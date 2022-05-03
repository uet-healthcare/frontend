import { mainAPI } from "utils/axios";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Editor from "components/editor";
import { useRef } from "react";
import {
  Box,
  Button,
  Flex,
  FormControl,
  FormErrorMessage,
  Input,
  SkeletonText,
  useToast,
} from "@chakra-ui/react";
import { BackButton } from "components/back-button";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { CommonSEO } from "components/seo";
import { getSocialImage } from "utils/utils";

const schemas = yup.object().shape({
  title: yup.string().required("Bạn chưa viết tiêu đề"),
  content: yup.string().required("Bạn chưa viết nội dung"),
});

const reduceContent = (content) => {
  let finalContent = content.trim();
  finalContent = finalContent.endsWith("\\")
    ? finalContent.substring(0, finalContent.length - 1)
    : finalContent;
  return finalContent;
};

export default function WritePost() {
  const router = useRouter();
  const toast = useToast();
  const [isImport, setIsImport] = useState(false);
  const [defaultContent, setDefaultContent] = useState("");
  const [importURL, setImportURL] = useState("");
  const [isImporting, setIsImporting] = useState(false);
  const uploadInputRef = useRef();
  const {
    register,
    getValues,
    setValue,
    trigger,
    handleSubmit,
    formState: { errors, isSubmitted },
  } = useForm({ resolver: yupResolver(schemas) });

  // debounce import from URL
  useEffect(() => {
    if (!importURL) return;
    setIsImporting(true);
    const timeoutID = setTimeout(async () => {
      try {
        const response = await fetch(importURL);
        const text = await response.text();
        setDefaultContent(text);
        setValue("content", text);
      } catch (error) {
        console.error(error);
        toast({
          title: "Import thất bại",
          description: "Không lấy được bài viết từ link đã cung cấp",
          status: "error",
          isClosable: true,
        });
      } finally {
        setIsImporting(false);
        setIsImport(false);
        trigger("content");
      }
    }, 1000);

    return () => clearTimeout(timeoutID);
  }, [toast, importURL, setValue, trigger]);

  const handlePost = (data) => {
    const { title, content } = data;

    mainAPI
      .post("/private/posts", { title, content })
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
          toast({
            title: "Đã có lỗi xảy ra",
            description: "Vui lòng thử lại sau hoặc liên hệ quản trị viên",
            status: "error",
            isClosable: true,
          });
          console.error("handlePost", response);
        }
      })
      .catch((error) => {
        console.error("handlePost catch", error.code);
      });
  };

  return (
    <>
      <CommonSEO title="Viết bài - Vietlach" ogImage={getSocialImage()} />
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
          <Flex
            as="form"
            onSubmit={handleSubmit(handlePost)}
            flexDirection="column"
            gap="3"
            py="8"
            w="full"
          >
            <Flex
              alignItems="center"
              gap="3"
              color="gray.400"
              _hover={{ color: "gray.600" }}
            >
              <BackButton />
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
              <Button type="submit" onClick={handlePost}>
                Đăng bài
              </Button>
            </Flex>
            <FormControl isInvalid={errors.title}>
              <Input placeholder="Tiêu đề bài viết" {...register("title")} />
              {errors.title && (
                <FormErrorMessage>{errors.title?.message}</FormErrorMessage>
              )}
            </FormControl>
            {!getValues("content") && (
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

                    setValue("title", file.name.replace(/\.[^/.]+$/, ""));

                    const reader = new FileReader();
                    reader.addEventListener(
                      "load",
                      () => {
                        setDefaultContent(reader.result);
                        setValue("content", reader.result);
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
              mt="4"
              gap={{ base: "4", sm: "6" }}
              lineHeight="tall"
              color="gray.900"
              fontSize="lg"
              spellCheck="false"
              sx={{ "& > div": { w: "full" } }}
            >
              {isImporting ? (
                <Box>
                  <SkeletonText mt="4" noOfLines={4} spacing="4" />
                </Box>
              ) : (
                <Editor
                  placeholder={"Viết điều gì đó..."}
                  defaultValue={defaultContent}
                  onChange={async (value) => {
                    setValue("content", reduceContent(value));
                    trigger("content");
                  }}
                />
              )}
            </Flex>
            <FormControl isInvalid={isSubmitted && errors.content}>
              <Input type="hidden" {...register("content")} />
              {isSubmitted && errors.content && (
                <FormErrorMessage>{errors.content?.message}</FormErrorMessage>
              )}
            </FormControl>
          </Flex>
        </Flex>
      </Box>
    </>
  );
}
