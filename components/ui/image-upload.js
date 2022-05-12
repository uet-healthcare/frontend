import { Box, Button, Icon, Image, useToast } from "@chakra-ui/react";
import { useRef } from "react";
import { BiImageAdd } from "react-icons/bi";
import { getS3FileUrl, storageClient } from "utils/storage";
import { generateRandomFileName } from "utils/utils";

export const ImageUpload = ({ src, alt, onUpload, ...props }) => {
  const toast = useToast();
  const fileRef = useRef();

  const handleUpload = async (event) => {
    if (!event.target.files || event.target.files.length === 0) return;
    const [file] = event.target.files;
    const fileName = generateRandomFileName(file);
    if (storageClient) {
      try {
        const response = await storageClient
          .from("public")
          .upload(`images/${fileName}`, file);
        if (response.data && response.data.Key) {
          onUpload(getS3FileUrl(response.data.Key));
          return;
        }
        toast({
          title: "Đã có lỗi xảy ra",
          description: "Không thể upload hình ảnh",
          status: "error",
          isClosable: true,
        });
      } catch (error) {
        toast({
          title: "Đã có lỗi xảy ra",
          description: "Không thể upload hình ảnh",
          status: "error",
          isClosable: true,
        });
        console.error(error);
      }
    } else {
      toast({
        title: "Bạn chưa đăng nhập",
        description: "Vui lòng đăng nhập để sử dụng chức năng này",
        status: "error",
        isClosable: true,
      });
    }
  };

  return (
    <>
      <input
        type="file"
        ref={fileRef}
        style={{ display: "none" }}
        onChange={handleUpload}
      />
      {src ? (
        <Box
          position="relative"
          w="32"
          h="32"
          borderRadius="lg"
          backgroundColor="gray.200"
        >
          <Image
            src={src}
            alt={alt}
            borderWidth="0"
            outline="none"
            w="full"
            h="full"
            borderRadius="lg"
            {...props}
          />
          <Button
            colorScheme="white"
            backgroundColor="white"
            color="gray.700"
            _hover={{
              color: "gray.800",
            }}
            border="1px"
            borderColor="gray.300"
            borderRadius="sm"
            shadow="sm"
            position="absolute"
            size="xs"
            top="1.5"
            right="1.5"
            onClick={() => fileRef.current.click()}
          >
            Thay đổi
          </Button>
        </Box>
      ) : (
        <Button
          type="button"
          borderRadius="lg"
          fontSize="xl"
          onClick={() => fileRef.current.click()}
          p="0"
          w="32"
          h="32"
          colorScheme="gray"
        >
          <Icon as={BiImageAdd} w="16" h="16" color="gray.500" />
        </Button>
      )}
    </>
  );
};
