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
  Text,
  useToast,
} from "@chakra-ui/react";
import { BackButton } from "components/back-button";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { CommonSEO } from "components/seo";
import { getSocialImage, reduceContent } from "utils/utils";

const schemas = yup.object().shape({
  title: yup.string().required("Bạn chưa viết tiêu đề"),
  content: yup.string().required("Bạn chưa viết nội dung"),
});

export default function WritePost() {
  const router = useRouter();
  const toast = useToast();
  const [isImport, setIsImport] = useState(false);
  const [defaultContent, setDefaultContent] = useState("");
  const [importURL, setImportURL] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const uploadInputRef = useRef();
  const postID = router.query.id;
  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [changeCount, setChangeCount] = useState(0);
  const [isPosting, setIsPosting] = useState(false);
  const timeoutDraftRef = useRef();

  const headerRef = useRef();

  const {
    register,
    setValue,
    trigger,
    watch,
    handleSubmit,
    formState: { errors, isSubmitted },
  } = useForm({ resolver: yupResolver(schemas) });

  const _title = watch("title");
  const _content = watch("content");

  useEffect(() => {
    if (!router.isReady || (!_title && !_content)) return;

    setChangeCount((value) => value + 1);
    setIsSaved(false);

    const saveDraft = async () => {
      setIsSaving(true);
      mainAPI
        .put("/private/posts", {
          id: postID,
          title: _title,
          content: _content,
          status: "draft",
        })
        .then((response) => {
          const responseData = response.data;
          if (
            response.status === 200 &&
            responseData.success &&
            responseData.data.post_id
          ) {
            setIsSaved(true);
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
        })
        .finally(() => {
          setIsSaving(false);
        });
    };

    if (changeCount >= 30) {
      saveDraft();
      setChangeCount(0);
    }

    timeoutDraftRef.current = setTimeout(() => {
      saveDraft();
      setChangeCount(0);
    }, 1000);

    return () => clearTimeout(timeoutDraftRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router, _title, _content]);

  // debounce import from URL
  useEffect(() => {
    if (!importURL) return;
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
        setIsLoading(false);
        setIsImport(false);
        trigger("content");
      }
    }, 1000);

    return () => clearTimeout(timeoutID);
  }, [toast, importURL, setValue, trigger]);

  useEffect(() => {
    if (!router.isReady) return;
    if (!postID) {
      mainAPI
        .post(`/private/posts`)
        .then((response) => {
          const responseData = response.data;
          if (response.status === 200 && responseData.success) {
            const { post_id } = responseData.data;
            if (post_id) {
              router.replace(`/viet-bai?id=${post_id}`);
            }
          }
        })
        .catch((error) => {
          toast({
            title: "Đã có lỗi xảy ra",
            description: "Không thể khởi tạo bài viết, vui lòng thử lại sau",
            status: "error",
            isClosable: true,
          });
          console.error(error);
        })
        .finally(() => {
          setIsLoading(false);
        });

      return;
    }

    const fetchData = async () => {
      setIsLoading(true);
      mainAPI
        .get(`/private/posts?id=${postID}`)
        .then((response) => {
          const responseData = response.data;
          if (response.status === 200 && responseData.success) {
            const { title, content } = responseData.data?.[0];
            setValue("title", title);
            setValue("content", content);
            setDefaultContent(content);
          }
        })
        .catch((error) => {
          toast({
            title: "Đã có lỗi xảy ra",
            description: "Không thể lấy dữ liệu bài viết. Vui lòng thử lại sau",
            status: "error",
            isClosable: true,
          });
          console.error(error);
        })
        .finally(() => {
          setIsLoading(false);
        });
    };
    fetchData();
  }, [router, postID, setValue, toast]);

  const handlePost = (status) => (data) => {
    clearTimeout(timeoutDraftRef.current);
    const { title, content } = data;

    setIsPosting(true);
    mainAPI
      .put("/private/posts", { id: postID, title, content, status })
      .then((response) => {
        const responseData = response.data;
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

        if (
          response.status === 200 &&
          responseData.success &&
          responseData.data.post_id
        ) {
          if (status === "draft") {
            router.push(`/me/bai-viet`);
          } else {
            router.push(`/bai-viet/${route}-${responseData.data.post_id}`);
          }
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
      })
      .finally(() => setIsPosting(false));
  };

  return (
    <>
      <CommonSEO title="Viết bài mới - Vietlach" ogImage={getSocialImage()} />
      <Box h="100vh" position="relative">
        <Flex
          justifyContent="space-between"
          alignSelf="flex-start"
          mx="auto"
          px="6"
          w="full"
          maxW="container.sm"
          overflow="auto"
        >
          <Flex
            as="form"
            onSubmit={handleSubmit(handlePost("public"))}
            flexDirection="column"
            gap="3"
            pt={`${16 + Math.floor(headerRef.current?.offsetHeight || 0)}px`}
            pb="8"
            w="full"
          >
            <Flex
              justifyContent="space-between"
              mb="6"
              position="fixed"
              top="0"
              left="0"
              zIndex="100"
              backgroundColor="white"
              pt="4"
              pb="5"
              w="full"
              ref={headerRef}
            >
              <Flex
                justifyContent="space-between"
                alignSelf="flex-start"
                mx="auto"
                px="6"
                w="full"
                maxW="container.sm"
                overflow="auto"
              >
                <Flex gap="1" alignItems="center">
                  <Flex
                    alignItems="center"
                    color="gray.400"
                    _hover={{ color: "gray.600" }}
                  >
                    <BackButton />
                  </Flex>
                  <Flex gap="5" alignItems="baseline">
                    <Box color="gray.700" fontFamily="heading">
                      Viết bài mới
                    </Box>
                    {isSaving && (
                      <Text color="gray.500" h="2">
                        Đang lưu...
                      </Text>
                    )}
                    {!isSaving && isSaved && (
                      <Text color="gray.600" h="2">
                        Đã lưu
                      </Text>
                    )}
                  </Flex>
                </Flex>
                <Flex gap="2" alignItems="center">
                  <Button type="submit" size="sm" isLoading={isPosting}>
                    Đăng bài
                  </Button>
                </Flex>
              </Flex>
            </Flex>
            <FormControl isInvalid={errors.title}>
              <Input placeholder="Tiêu đề bài viết" {...register("title")} />
              {errors.title && (
                <FormErrorMessage>{errors.title?.message}</FormErrorMessage>
              )}
            </FormControl>
            {!_content && (
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
              flexDirection="column"
              mt="4"
              gap={{ base: "4", sm: "6" }}
              lineHeight="tall"
              color="gray.900"
              fontSize="lg"
              spellCheck="false"
              sx={{ "& > div": { w: "full" } }}
            >
              {isLoading ? (
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
