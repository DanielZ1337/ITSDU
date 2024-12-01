export type SettingsOptions = {
  CustomPDFrenderer: boolean;
  CustomTitleBar: boolean;
  CustomTitleBarButtons: boolean;
  UploadAIChats: boolean;
  DefaultAIChatSidepanel: boolean;
  CustomPDFSidebarOpened: boolean;
  // theme: string;
  // language: string;
};

export const defaultSettings: SettingsOptions = {
  CustomPDFrenderer: true,
  CustomTitleBar: true,
  CustomTitleBarButtons: true,
  UploadAIChats: true,
  DefaultAIChatSidepanel: true,
  CustomPDFSidebarOpened: true,
};
