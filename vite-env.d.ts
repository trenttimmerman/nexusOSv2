/// <reference types="vite/client" />

// Allow importing .md files as raw strings
declare module '*.md' {
  const content: string;
  export default content;
}

declare module '*.md?raw' {
  const content: string;
  export default content;
}
