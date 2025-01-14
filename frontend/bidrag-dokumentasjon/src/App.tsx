import "@cubone/react-file-manager/dist/style.css";
import "highlight.js/styles/default.css";

import {TreeItem} from "@mui/x-tree-view";
import {SimpleTreeView} from "@mui/x-tree-view/SimpleTreeView";
import {Box, Heading, Loader, Modal, Switch, VStack} from "@navikt/ds-react";
import {useSuspenseQuery} from "@tanstack/react-query";
import mermaid from "mermaid";
import {Octokit} from "octokit";
import {ChangeEvent, createContext, useContext, useEffect, useRef, useState} from "react";
import React from "react";
import Markdown from "react-markdown";
import remarkRaw from "rehype-raw";
import remarkGfm from "remark-gfm";
import svgPanZoom from "svg-pan-zoom";
import {MarkdownComponents} from "./components/CustomMarkdown.tsx";
import {Button} from "@navikt/ds-react";
import {XMarkIcon} from "@navikt/aksel-icons";
import {EyeIcon} from "@navikt/aksel-icons";
import {ChevronRightLastIcon} from "@navikt/aksel-icons";
import {ChevronLeftIcon} from "@navikt/aksel-icons";

mermaid.initialize({
  startOnLoad: true,
  flowchart: {useMaxWidth: true, htmlLabels: true, curve: "basis"},
  securityLevel: "loose",
  look: "handDrawn",
  theme: "base",
});

const octokit = new Octokit({});

export interface GithubContent {
  name: string;
  path: string;
  sha: string;
  size: number;
  url: string;
  html_url: string;
  git_url: string;
  download_url: string;
  type: string;
  _links: Links;
}

export interface Links {
  self: string;
  git: string;
  html: string;
}

type FileType = "mermaid" | "markdown";
type Content = {
  type: FileType;
  content: string;
};

interface AppContextType {
  showContent?: Content;
  setShowContent: (content: Content) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);
export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useJournalpost must be used within a JournalpostProvider");
  }
  return context;
};
export default function DokumentasjonPage() {
  const [showContent, setShowContent] = useState<Content | undefined>();
  const [isExpanded, setIsExpanded] = useState(true);

  async function readFileAsText(ev: ChangeEvent<HTMLInputElement>): Promise<Content> {
    const files = ev.target.files;
    if (files.length == 0) return;
    const file = ev.target.files[0];
    const fileBuffer = await file.text();

    return {content: fileBuffer, type: file.name.endsWith(".mermaid") ? "mermaid" : "markdown"};
  }

  async function openFile(ev: ChangeEvent<HTMLInputElement>) {
    const fileBuffer = await readFileAsText(ev);
    setShowContent(fileBuffer);
  }

  return (
      <AppContext.Provider value={{showContent, setShowContent}}>

        <div className="h-full w-full flex flex-row [&_svg]:!max-w-full">
          <VStack  id="drawer-navigation" className={`  transition-transform ${isExpanded ? "-translate-x" : "-translate-x-96"} bg-white border border-solid border-black`}>
              <div className={"flex flex-row justify-end"}>
                <Button className={"h-fit self-end"} variant={"primary"} size={"xsmall"} icon={isExpanded ? <ChevronLeftIcon/> : <ChevronRightLastIcon/>} onClick={()=>setIsExpanded((a)=>!a)}></Button>
              </div>
              <Box
                  background="surface-default"
                  className={"border-t-2 border-black pl-2"}
              >
                <Heading size="xsmall">Last lokal fil</Heading>
                <input
                    id="file_input"
                    type="file"
                    name="Last fra fil"
                    accept="*/.mermaid, *.md, *.markdown"
                    onClick={(ev) => ((ev.target as HTMLInputElement).value = "")}
                    onChange={openFile}
                    className="border"
                />
              </Box>
              <Box
                  className="w-[400px] h-full"
                  borderRadius={"medium"}
                  borderColor="border-default"
                  borderWidth="2"
                  padding={"2"}
              >
                <Heading size="xsmall">Github</Heading>
                <React.Suspense fallback={<Loader/>}>
                  <GithubTreeView/>
                </React.Suspense>
              </Box>
            </VStack>

          <MermaidChart/>
        </div>
      </AppContext.Provider>
  );
}

function GithubTreeView() {
  const {setShowContent} = useAppContext();
  const [githubEnabled, setGithubEnabled] = useState(true);

  async function updateShowedContent(link: string) {
    if (link.startsWith("folder_")) return;
    const content = await fetch(link);
    content.text().then((data) => {
      setShowContent({content: data, type: link.endsWith(".mermaid") ? "mermaid" : "markdown"});
    });
  }

  const {data: content} = useSuspenseQuery({
    queryKey: ["gitPage", githubEnabled],
    queryFn: async (): Promise<GithubContent[]> => {
      if (!githubEnabled) return [];
      const response = await octokit.request("GET /repos/navikt/bidrag-dokumentasjon/contents/dokumentasjon", {
        owner: "navikt",
        repo: "bidrag-dokumentasjon",
      });
      return response.data as GithubContent[];
    },
  });
  const files = content?.filter((file) => file.type === "file") ?? [];

  return (
      <>
        <Switch size="small" checked={githubEnabled} onChange={(e) => setGithubEnabled(e.target.checked)}>
          Hent fra github
        </Switch>
        <SimpleTreeView
            defaultExpandedItems={["folder_root", `folder_dokumentasjon`]}
            onItemClick={(event, itemId) => updateShowedContent(itemId)}
        >
          <TreeItem itemId="folder_root" label={"bidrag-dokumentasjon"}>
            {files.map((file) => (
                <TreeItem itemId={file.download_url} label={file.name}/>
            ))}
            {content?.filter((file) => file.type === "dir")
            .filter((folder) => folder.name != ".github" && folder.name != "frontend")
            .map((folder) => <GithubTree folder={folder}/>)}
          </TreeItem>
        </SimpleTreeView>
      </>
  );
}

function GithubTree({folder}: { folder: GithubContent }) {
  const {data: content} = useSuspenseQuery({
    queryKey: ["gitPage", folder.path],
    queryFn: async (): Promise<GithubContent[]> => {
      const response = await octokit.request(
          `GET /repos/navikt/bidrag-dokumentasjon/contents/${folder.path}`,
          {
            owner: "navikt",
            repo: "bidrag-dokumentasjon",
          }
      );
      return response.data as GithubContent[];
    },
  });

  return (
      <TreeItem itemId={`folder_${folder.path}`} label={folder.name}>
        {content
        .filter((file) => file.type === "file")
        .map((file) => (
            <TreeItem itemId={file.download_url} label={file.name}/>
        ))}
        {content
        .filter((file) => file.type === "dir")
        .map((folder) => (
            <GithubTree folder={folder}/>
        ))}
      </TreeItem>
  );
}

function MermaidChart() {
  const {showContent} = useAppContext();
  const [showDetailsMarkdown, setShowDetailsMarkdown] = useState<string | null>(null);

  const isRendering = useRef(false);
  const divRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    // @ts-ignore
    window.callbackKotlin = (link: string) => {
      fetch(link)
      .then((res) => res.text())
      .then(async (data) => {
        setShowDetailsMarkdown(`${"```kotlin\n"}${data}\n${"```"}`);
      });
    };
    // @ts-ignore
    window.visGrunnlag = (link: string) => {
      fetch(`https://raw.githubusercontent.com/navikt/bidrag-dokumentasjon/refs/heads/main/${link}`)
      .then((res) => res.text())
      .then(async (data) => {
        setShowDetailsMarkdown(data);
      });
    };
  }, []);
  useEffect(() => {
    if (!showContent) return;
    if (showContent?.type != "mermaid") {
      document.getElementById("mermaidSvg")?.remove();
      return;
    }
    isRendering.current = true;
    mermaid
    .render("mermaidSvg", showContent.content, divRef.current)
    .then((res) => {
      divRef.current.innerHTML = res.svg;
      if (res.bindFunctions) {
        res.bindFunctions(divRef.current.firstElementChild);
      }
      svgPanZoom("#mermaidSvg");
    })
    .catch((e) => console.error("HERE", e));
  }, [mermaid, showContent]);

  return (
      <>
        <Modal
            aria-label={""}
            style={{maxHeight: "1000px", maxWidth: "max-content"}}
            open={showDetailsMarkdown != null}
            closeOnBackdropClick
            onClose={() => setShowDetailsMarkdown(null)}
        >
          <Modal.Body>
            <Markdown components={MarkdownComponents} remarkPlugins={[remarkGfm]} rehypePlugins={[remarkRaw]}>
              {showDetailsMarkdown}
            </Markdown>
          </Modal.Body>
        </Modal>
        {showContent?.type == "mermaid" ? (
            <div ref={divRef} className="mermaid h-full grow w-full max-w-full [&_svg]:!max-w-full"/>
        ) : showContent ? (
            <div className="pt-8 m-auto overflow-y-auto h-full w-[1100px] pl-8 pr-8 pb-8">
              <Markdown components={MarkdownComponents} remarkPlugins={[remarkGfm]} rehypePlugins={[remarkRaw]}>
                {showContent.content}
              </Markdown>
            </div>
        ) : null}
      </>
  );
}