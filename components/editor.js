import { useToast } from "@chakra-ui/react";
import RichMarkdownEditor from "rich-markdown-editor";
import { getS3FileUrl, storageClient } from "utils/storage";
import { generateRandomFileName } from "utils/utils";

const colors = {
  almostBlack: "#181A1B",
  lightBlack: "#2F3336",
  almostWhite: "#E6E6E6",
  white: "#FFF",
  white10: "rgba(255, 255, 255, 0.1)",
  black: "#000",
  black10: "rgba(0, 0, 0, 0.1)",
  primary: "#1AB6FF",
  greyLight: "#F4F7FA",
  grey: "#E8EBED",
  greyMid: "#C5CCD3",
  greyDark: "#DAE1E9",
};

export const base = {
  ...colors,
  fontFamily:
    "Avenir Next,-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Oxygen, Ubuntu,Cantarell,'Open Sans','Helvetica Neue',sans-serif",
  fontFamilyMono:
    "'SFMono-Regular',Consolas,'Liberation Mono', Menlo, Courier,monospace",
  fontWeight: 400,
  zIndex: 100,
  link: colors.primary,
  placeholder: "#B1BECC",
  textSecondary: "#4E5C6E",
  textLight: colors.white,
  textHighlight: "#b3e7ff",
  textHighlightForeground: colors.black,
  selected: colors.primary,
  codeComment: "#6a737d",
  codePunctuation: "#5e6687",
  codeNumber: "#d73a49",
  codeProperty: "#c08b30",
  codeTag: "#3d8fd1",
  codeString: "#032f62",
  codeSelector: "#6679cc",
  codeAttr: "#c76b29",
  codeEntity: "#22a2c9",
  codeKeyword: "#d73a49",
  codeFunction: "#6f42c1",
  codeStatement: "#22a2c9",
  codePlaceholder: "#3d8fd1",
  codeInserted: "#202746",
  codeImportant: "#c94922",

  blockToolbarBackground: colors.white,
  blockToolbarTrigger: colors.greyMid,
  blockToolbarTriggerIcon: colors.white,
  blockToolbarItem: colors.almostBlack,
  blockToolbarIcon: undefined,
  blockToolbarIconSelected: colors.black,
  blockToolbarText: colors.almostBlack,
  blockToolbarTextSelected: colors.black,
  blockToolbarSelectedBackground: colors.greyMid,
  blockToolbarHoverBackground: colors.greyLight,
  blockToolbarDivider: colors.greyMid,

  noticeInfoBackground: "#F5BE31",
  noticeInfoText: colors.almostBlack,
  noticeTipBackground: "#9E5CF7",
  noticeTipText: colors.white,
  noticeWarningBackground: "#FF5C80",
  noticeWarningText: colors.white,
};

export const light = {
  ...base,
  background: colors.white,
  text: colors.almostBlack,
  code: colors.lightBlack,
  cursor: colors.black,
  divider: colors.greyMid,

  toolbarBackground: colors.lightBlack,
  toolbarHoverBackground: colors.black,
  toolbarInput: colors.white10,
  toolbarItem: colors.white,

  tableDivider: colors.greyMid,
  tableSelected: colors.primary,
  tableSelectedBackground: "#E5F7FF",

  quote: colors.greyDark,
  codeBackground: colors.greyLight,
  codeBorder: colors.grey,
  horizontalRule: colors.greyMid,
  imageErrorBackground: colors.greyLight,

  scrollbarBackground: colors.greyLight,
  scrollbarThumb: colors.greyMid,
};

export const dark = {
  ...base,
  background: colors.almostBlack,
  text: colors.almostWhite,
  code: colors.almostWhite,
  cursor: colors.white,
  divider: "#4E5C6E",
  placeholder: "#52657A",

  toolbarBackground: colors.white,
  toolbarHoverBackground: colors.greyMid,
  toolbarInput: colors.black10,
  toolbarItem: colors.lightBlack,

  tableDivider: colors.lightBlack,
  tableSelected: colors.primary,
  tableSelectedBackground: "#002333",

  quote: colors.greyDark,
  codeBackground: colors.black,
  codeBorder: colors.lightBlack,
  codeString: "#3d8fd1",
  horizontalRule: colors.lightBlack,
  imageErrorBackground: "rgba(0, 0, 0, 0.5)",

  scrollbarBackground: colors.black,
  scrollbarThumb: colors.lightBlack,
};

export default function Editor({ placeholder, defaultValue, onChange }) {
  const toast = useToast();

  return (
    <RichMarkdownEditor
      value={defaultValue}
      placeholder={placeholder}
      onChange={(getValue) => onChange(getValue())}
      disableExtensions={["container_notice", "checkbox_list"]}
      theme={light}
      dictionary={{
        newLineEmpty: "G?? '/' ????? ch??n ti??u ?????, ???????ng d???n hay ???nh...",
      }}
      uploadImage={async (file) => {
        const fileName = generateRandomFileName(file);
        if (storageClient) {
          try {
            const response = await storageClient
              .from("public")
              .upload(`images/${fileName}`, file);
            if (response.data && response.data.Key) {
              return getS3FileUrl(response.data.Key);
            }
            toast({
              title: "???? c?? l???i x???y ra",
              description: "Kh??ng th??? upload h??nh ???nh",
              status: "error",
              isClosable: true,
            });
          } catch (error) {
            toast({
              title: "???? c?? l???i x???y ra",
              description: "Kh??ng th??? upload h??nh ???nh",
              status: "error",
              isClosable: true,
            });
            console.error(error);
          }
        } else {
          toast({
            title: "B???n ch??a ????ng nh???p",
            description: "Vui l??ng ????ng nh???p ????? s??? d???ng ch???c n??ng n??y",
            status: "error",
            isClosable: true,
          });
        }
      }}
    />
  );
}
