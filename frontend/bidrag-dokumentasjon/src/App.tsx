import "@cubone/react-file-manager/dist/style.css";
import "highlight.js/styles/default.css";

import {Drawer} from "@mui/material";
import {ChevronLeftIcon, ChevronRightLastIcon} from "@navikt/aksel-icons";
import {TreeItem} from "@mui/x-tree-view";
import {SimpleTreeView} from "@mui/x-tree-view/SimpleTreeView";
import {Alert, BodyShort, Box, Button, Heading, Loader, Modal, Switch, VStack} from "@navikt/ds-react";
import {useQuery} from "@tanstack/react-query";
import mermaid from "mermaid";
import {Octokit} from "octokit";
import {ChangeEvent, createContext, Dispatch, SetStateAction, SyntheticEvent, useContext, useEffect, useRef, useState} from "react";
import Markdown from "react-markdown";
import remarkRaw from "rehype-raw";
import remarkGfm from "remark-gfm";
import svgPanZoom from "svg-pan-zoom";
import {MarkdownComponents} from "./components/CustomMarkdown.tsx";

mermaid.initialize({
  startOnLoad: true,
  flowchart: {useMaxWidth: true, htmlLabels: true, curve: "basis"},
  securityLevel: "loose",
  look: "handDrawn",
  theme: "base",
});

const octokit = new Octokit({});
const GITHUB_OWNER = "navikt";
const GITHUB_REPO = "bidrag-dokumentasjon";
const GITHUB_ROOT_PATH = "dokumentasjon";
type GithubRequestError = {
  status?: number;
  message?: string;
  response?: {
    data?: {
      message?: string;
    };
    headers?: Record<string, string>;
  };
};

type GithubErrorDetails = {
  title: string;
  message: string;
};

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
  expandedFolders: string[];
  setExpandedFolders: Dispatch<SetStateAction<string[]>>;
  setShowContent: (content: Content) => void;
}

function formatRateLimitReset(resetAt?: string): string | null {
  if (!resetAt) return null;

  const resetTimestamp = Number(resetAt);
  if (!Number.isFinite(resetTimestamp)) return null;

  return new Date(resetTimestamp * 1000).toLocaleString("nb-NO", {
    hour: "2-digit",
    minute: "2-digit",
    day: "2-digit",
    month: "2-digit",
  });
}

function isGithubRateLimitError(error: unknown): boolean {
  const githubError = error as GithubRequestError | undefined;
  const message = githubError?.response?.data?.message ?? githubError?.message ?? "";
  return githubError?.status === 403 && /rate limit/i.test(message);
}

function getGithubErrorDetails(error: unknown): GithubErrorDetails {
  const githubError = error as GithubRequestError | undefined;
  const message = githubError?.response?.data?.message ?? githubError?.message ?? "Ukjent feil ved henting fra GitHub.";
  const resetAt = formatRateLimitReset(githubError?.response?.headers?.["x-ratelimit-reset"]);

  return {
    title: "GitHub svarte med rate limit",
    message: resetAt
        ? `${message} Kvoten nullstilles omtrent ${resetAt}.`
        : `${message} Prov igjen senere eller bruk lokal fil i mellomtiden.`,
  };
}

function shouldRetryGithubRequest(failureCount: number, error: unknown): boolean {
  if (isGithubRateLimitError(error)) {
    return false;
  }

  return failureCount < 2;
}

function sortGithubContent(content: GithubContent[]): GithubContent[] {
  return [...content].sort((left, right) => {
    if (left.type !== right.type) {
      return left.type === "dir" ? -1 : 1;
    }

    return left.name.localeCompare(right.name, "nb");
  });
}

function TreeLabel({name, badge}: { name: string; badge: string }) {
  return (
      <span className="tree-label">
        <span className="tree-label__name" title={name}>{name}</span>
        <span className="tree-label__badge">{badge}</span>
      </span>
  );
}

function GithubInfo({error}: { error: unknown }) {
  if (!error || !isGithubRateLimitError(error)) {
    return null;
  }

  const errorDetails = getGithubErrorDetails(error);

  return (
      <VStack gap="3" className="github-info-stack">
        <Alert variant="warning" size="small">
          <Heading spacing size="xsmall" level="3">{errorDetails.title}</Heading>
          <BodyShort size="small">{errorDetails.message}</BodyShort>
          <BodyShort size="small">
            Dette skjer fordi appen henter direkte fra GitHub API-et i nettleseren uten autentisering. En bedre losning er en backend eller proxy med token pa serversiden.
          </BodyShort>
        </Alert>
      </VStack>
  );
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
  const [expandedFolders, setExpandedFolders] = useState<string[]>(["folder_root", "folder_dokumentasjon"]);
  const [isExpanded, setIsExpanded] = useState(true);
  const [selectedFileName, setSelectedFileName] = useState<string | null>(null);

  async function readFileAsText(ev: ChangeEvent<HTMLInputElement>): Promise<Content | undefined> {
    const files = ev.target.files;
    if (!files || files.length === 0) return undefined;

    const file = files[0];
    const fileBuffer = await file.text();

    return {content: fileBuffer, type: file.name.endsWith(".mermaid") ? "mermaid" : "markdown"};
  }

  async function openFile(ev: ChangeEvent<HTMLInputElement>) {
    const fileBuffer = await readFileAsText(ev);
    const file = ev.target.files?.[0];
    if (!fileBuffer || !file) return;

    setSelectedFileName(file.name);
    setShowContent(fileBuffer);
  }

  return (
      <AppContext.Provider value={{showContent, setShowContent, setExpandedFolders, expandedFolders}}>
        <div className="app-shell h-full w-full flex flex-row [&_svg]:!max-w-full">
          {!isExpanded ? (
              <Button
                  size="small"
                  variant="secondary-neutral"
                  className="sidebar-open-button"
                  onClick={() => setIsExpanded(true)}
                  icon={<ChevronRightLastIcon aria-hidden/>}
              >
                Kilder
              </Button>
          ) : null}
          <Drawer
              open={isExpanded}
              onClose={() => setIsExpanded(false)}
              slotProps={{paper: {className: "sidebar-drawer-paper"}}}
          >
            <VStack id="drawer-navigation" gap="4" className="sidebar-panel">
              <div className="sidebar-header">
                <div>
                  <BodyShort size="small" className="sidebar-header__eyebrow">Bidrag-dokumentasjon</BodyShort>
                  <Heading size="small" level="1">Kilder</Heading>
                </div>
                <Button
                    size="small"
                    variant="tertiary-neutral"
                    onClick={() => setIsExpanded(false)}
                    icon={<ChevronLeftIcon aria-hidden/>}
                >
                  Skjul
                </Button>
              </div>
              <Box className="sidebar-section">
                <Heading size="xsmall" level="2">Last lokal fil</Heading>
                <BodyShort size="small" className="sidebar-copy">
                  Åpne en lokal markdown- eller mermaid-fil uten å bruke GitHub-kvoten.
                </BodyShort>
                <label htmlFor="file_input" className="file-picker-card">
                  <span className="file-picker-card__title">Velg fil fra maskinen</span>
                  <span className="file-picker-card__meta">
                    {selectedFileName ?? "Støtter .md, .markdown og .mermaid"}
                  </span>
                </label>
                <input
                    id="file_input"
                    type="file"
                    name="Last fra fil"
                    accept=".mermaid,.md,.markdown"
                    onClick={(ev) => ((ev.target as HTMLInputElement).value = "")}
                    onChange={(event) => {
                      void openFile(event);
                    }}
                    className="file-picker-input"
                />
              </Box>
              <Box className="sidebar-section sidebar-section--fill">
                <Heading size="xsmall" level="2">GitHub</Heading>
                <BodyShort size="small" className="sidebar-copy">
                  Bla i dokumentasjonen direkte fra repoet og åpne filer ved behov.
                </BodyShort>
                <GithubTreeView/>
              </Box>
            </VStack>
          </Drawer>
          <MermaidChart/>
        </div>
      </AppContext.Provider>
  );
}

function GithubTreeView() {
  const {setShowContent, expandedFolders, setExpandedFolders} = useAppContext();
  const [githubEnabled, setGithubEnabled] = useState(true);

  async function updateShowedContent(_event: SyntheticEvent, itemId: string) {
    if (itemId.startsWith("folder_")) {
      setExpandedFolders((prev) => {
        if (prev.includes(itemId)) {
          return prev.filter((folder) => folder !== itemId);
        }
        return [...prev, itemId];
      });
      return;
    }

    const content = await fetch(itemId);
    const data = await content.text();
    setShowContent({content: data, type: itemId.endsWith(".mermaid") ? "mermaid" : "markdown"});
  }

  const {data: content = [], error, isLoading} = useQuery<GithubContent[]>({
    queryKey: ["gitPage", GITHUB_ROOT_PATH, githubEnabled],
    enabled: githubEnabled,
    retry: shouldRetryGithubRequest,
    queryFn: async (): Promise<GithubContent[]> => {
      const response = await octokit.request(`GET /repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${GITHUB_ROOT_PATH}`, {
        owner: GITHUB_OWNER,
        repo: GITHUB_REPO,
      });
      return response.data as GithubContent[];
    },
  });

  const sortedContent = sortGithubContent(content);
  const files = sortedContent.filter((file) => file.type === "file");
  const folders = sortedContent
  .filter((file) => file.type === "dir")
  .filter((folder) => folder.name !== ".github" && folder.name !== "frontend");

  return (
      <VStack gap="4" className="github-section">
        <div className="github-toolbar">
          <Switch size="small" checked={githubEnabled} onChange={(e) => setGithubEnabled(e.target.checked)}>
            Hent fra GitHub
          </Switch>
        </div>
        <GithubInfo error={error}/>
        {!githubEnabled ? (
            <BodyShort size="small" className="sidebar-empty-state">
              GitHub-visningen er skrudd av. Bruk lokal fil eller slå på bryteren for å hente fra repoet.
            </BodyShort>
        ) : isLoading && content.length === 0 ? (
            <div className="tree-loading-state">
              <Loader size="large" title="Laster GitHub-innhold"/>
            </div>
        ) : error ? null : (
            <div className="tree-shell">
              <SimpleTreeView
                  expandedItems={expandedFolders}
                  onItemClick={(event, itemId) => {
                    void updateShowedContent(event, itemId);
                  }}
              >
                <TreeItem itemId="folder_root" label={<TreeLabel name={GITHUB_REPO} badge="repo"/>}>
                  {files.map((file) => (
                      <TreeItem key={file.path} itemId={file.download_url} label={<TreeLabel name={file.name} badge="fil"/>}/>
                  ))}
                  {folders.map((folder) => <GithubTree key={folder.path} folder={folder}/>)}
                </TreeItem>
              </SimpleTreeView>
            </div>
        )}
      </VStack>
  );
}

function GithubTree({folder}: { folder: GithubContent }) {
  const {expandedFolders} = useAppContext();
  const folderItemId = `folder_${folder.path}`;
  const isExpanded = expandedFolders.includes(folderItemId);
  const {data: content = [], error, isLoading} = useQuery<GithubContent[]>({
    queryKey: ["gitPage", folder.path],
    enabled: isExpanded,
    retry: shouldRetryGithubRequest,
    queryFn: async (): Promise<GithubContent[]> => {
      const response = await octokit.request(`GET /repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${folder.path}`, {
        owner: GITHUB_OWNER,
        repo: GITHUB_REPO,
      });
      return response.data as GithubContent[];
    },
  });

  const sortedContent = sortGithubContent(content);
  const files = sortedContent.filter((file) => file.type === "file");
  const folders = sortedContent.filter((file) => file.type === "dir");
  const treeError = error ? getGithubErrorDetails(error) : null;

  return (
      <TreeItem itemId={folderItemId} label={<TreeLabel name={folder.name} badge="mappe"/>}>
      {isExpanded && isLoading && content.length === 0 ? (
            <TreeItem itemId={`loading_${folder.path}`} label={<TreeLabel name="Laster innhold" badge="venter"/>}/>
        ) : null}
      {treeError && isGithubRateLimitError(error) ? (
            <TreeItem itemId={`error_${folder.path}`} label={<TreeLabel name={treeError.title} badge="feil"/>}/>
        ) : null}
        {files.map((file) => (
            <TreeItem key={file.path} itemId={file.download_url} label={<TreeLabel name={file.name} badge="fil"/>}/>
        ))}
        {folders.map((childFolder) => (
            <GithubTree key={childFolder.path} folder={childFolder}/>
        ))}
      </TreeItem>
  );
}

function MermaidChart() {
  const {showContent} = useAppContext();
  const [showDetailsMarkdown, setShowDetailsMarkdown] = useState<string | null>(null);

  const isRendering = useRef(false);
  const divRef = useRef<HTMLPreElement>(null);

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
    // @ts-ignore
    window.visMarkdown = (innhold: string) => {
      console.log(innhold.replace(/[\t\n]/g, " "));
      setShowDetailsMarkdown(innhold.replace(/ +/g, " "));
    };
  }, []);

  useEffect(() => {
    if (!showContent) return;
    if (showContent.type !== "mermaid") {
      document.getElementById("mermaidSvg")?.remove();
      return;
    }

    isRendering.current = true;
    mermaid
    .render("mermaidSvg", showContent.content, divRef.current)
    .then((res) => {
      if (!divRef.current) return;

      divRef.current.innerHTML = res.svg;
      if (res.bindFunctions) {
        res.bindFunctions(divRef.current.firstElementChild as Element);
      }
      svgPanZoom("#mermaidSvg");
    })
    .catch((error) => console.error("HERE", error));
  }, [showContent]);

  return (
      <>
        <Modal
            aria-label="Detaljvisning"
            style={{maxHeight: "1000px", maxWidth: "max-content"}}
            open={showDetailsMarkdown !== null}
            closeOnBackdropClick
            onClose={() => setShowDetailsMarkdown(null)}
        >
          <Modal.Body>
            <Markdown components={MarkdownComponents} remarkPlugins={[remarkGfm]} rehypePlugins={[remarkRaw]}>
              {showDetailsMarkdown}
            </Markdown>
          </Modal.Body>
        </Modal>
        {showContent?.type === "mermaid" ? (
            <pre ref={divRef} className="mermaid h-full grow w-full max-w-full [&_svg]:!max-w-full"/>
        ) : showContent ? (
            <div className="pt-8 m-auto overflow-y-auto h-full w-[1100px] pl-8 pr-8 pb-8">
              <Markdown components={MarkdownComponents} remarkPlugins={[remarkGfm]} rehypePlugins={[remarkRaw]}>
                {showContent.content}
              </Markdown>
            </div>
        ) : (
            <div className="content-placeholder">
              <Heading size="small" level="2">Velg innhold</Heading>
              <BodyShort>
                Åpne en lokal fil eller hent dokumentasjon fra GitHub-panelet for å vise markdown eller mermaid.
              </BodyShort>
            </div>
        )}
      </>
  );
}