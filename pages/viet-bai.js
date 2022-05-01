import { mainAPI } from "utils/axios";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Editor from "components/editor";
import { useRef } from "react";
import { Box, Button, Flex, Input } from "@chakra-ui/react";

export default function WritePost() {
  const router = useRouter();
  const [isImport, setIsImport] = useState(false);
  const [title, setTitle] = useState("");
  const [defaultContent, setDefaultContent] = useState("");
  const [content, setContent] = useState("");
  const [importURL, setImportURL] = useState("");
  const [isImporting, setIsImporting] = useState(false);
  const uploadInputRef = useRef();

  // debounce import from URL
  useEffect(() => {
    if (!importURL) return;
    setIsImporting(true);
    const timeoutID = setTimeout(async () => {
      try {
        const response = await fetch(importURL);
        const text = await response.text();
        setDefaultContent(text);
        setContent(text);
      } catch (error) {
        console.error(error);
        alert("Cannot import from " + importURL);
      } finally {
        setIsImporting(false);
      }
    }, 1000);

    return () => clearTimeout(timeoutID);
  }, [importURL]);

  const handlePost = () => {
    let finalContent = content.trim();
    finalContent = finalContent.endsWith("\\")
      ? finalContent.substring(0, finalContent.length - 1)
      : finalContent;

    mainAPI
      .post("/private/posts", { title, content: finalContent })
      .then((response) => {
        const route = title
          .split("")
          .filter(
            (el) =>
              el.match(/^-?\d+$/) ||
              el === " " ||
              el === "." ||
              el.toLowerCase() !== el.toUpperCase()
          )
          .map((el) => (el === " " || el === "." ? "-" : el))
          .join("");

        if (response.status === 200 && response.data.post_id) {
          router.push(`/bai-viet/${route}-${response.data.post_id}`);
        } else {
          alert("something went wrong.");
          console.error(response);
        }
      })
      .catch((error) => {
        console.error(error.code);
      });
  };

  return (
    <>
      <Box h="100vh" position="relative">
        <Flex
          alignItems="baseline"
          justifyContent="space-between"
          mx="auto"
          px="6"
          w="full"
          maxW="container.sm"
          overflow="auto"
        >
          <Flex flexDirection="column" gap="3" py="8" w="full">
            <Flex
              alignItems="center"
              gap="3"
              color="gray.400"
              _hover={{ color: "gray.600" }}
            >
              <Button
                variant="ghost"
                fontSize="xl"
                onClick={() => {
                  console.log(window.history.length);
                  if (window.history.length > 2) router.back();
                  else router.push("/");
                }}
              >
                &larr;
              </Button>
            </Flex>
            <Flex alignItems="center" justifyContent="space-between" mb="6">
              <Box
                as="h1"
                fontSize="2xl"
                fontWeight="semibold"
                color="gray.600"
                fontFamily="heading"
              >
                Tạo bài viết mới
              </Box>
              <Button disabled={!title || !content} onClick={handlePost}>
                Đăng bài
              </Button>
            </Flex>
            <Input
              placeholder="Tiêu đề bài viết"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            {(!content || content === "\\\n") && (
              <div>
                <Box
                  as="input"
                  display="none"
                  ref={uploadInputRef}
                  type="file"
                  accept="text/plain, text/markdown"
                  onChange={(e) => {
                    if (!e.target.files.length) {
                      return;
                    }
                    const [file] = e.target.files;
                    if (!file) {
                      return;
                    }

                    setTitle(file.name.replace(/\.[^/.]+$/, ""));

                    const reader = new FileReader();
                    reader.addEventListener(
                      "load",
                      () => {
                        setDefaultContent(reader.result);
                        setContent(reader.result);
                      },
                      false
                    );
                    reader.readAsText(file);
                  }}
                />
                {isImport && (
                  <Input
                    mb="2.5"
                    placeholder="https://example.com/duong-dan-den-file-markdown.md"
                    value={importURL}
                    onChange={(e) => setImportURL(e.target.value)}
                  />
                )}
                <Flex flexWrap="wrap" gap="1" fontSize="sm" color="gray.500">
                  <span>Bạn đã có bài viết?</span>
                  <Box
                    as="button"
                    type="button"
                    textDecoration="underline"
                    className="underline"
                    onClick={() => uploadInputRef.current.click()}
                  >
                    upload
                  </Box>
                  <span>hoặc</span>
                  <Box
                    as="button"
                    type="button"
                    textDecoration="underline"
                    onClick={() => setIsImport((value) => !value)}
                  >
                    import
                  </Box>
                  <span>file của bạn.</span>
                  <span>(chỉ hỗ trợ định dạng markdown)</span>
                </Flex>
              </div>
            )}
            <Flex
              flexDirection="col"
              pb="8"
              mt="4"
              gap={{ base: "4", md: "6" }}
              lineHeight="tall"
              color="gray.900"
              fontSize="lg"
              spellCheck="false"
              sx={{ "& > div": { w: "full" } }}
            >
              {isImporting ? (
                <div>loading...</div>
              ) : (
                <Editor
                  placeholder={"Viết điều gì đó..."}
                  defaultValue={defaultContent}
                  onChange={(value) => setContent(value)}
                />
              )}
            </Flex>
          </Flex>
        </Flex>
      </Box>
    </>
  );
}
