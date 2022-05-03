import { Box, Button, Flex, Text } from "@chakra-ui/react";
import React from "react";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);

    // Define a state variable to track whether is an error or not
    this.state = { hasError: false };
  }
  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI

    return { hasError: true };
  }
  componentDidCatch(error, errorInfo) {
    // You can use your own error logging service here
    // console.log({ error, errorInfo });
  }
  render() {
    // Check if the error is thrown
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return (
        <Flex
          w="100vw"
          h="100vh"
          justifyItems="center"
          px="8"
          pt={{ base: "16", sm: "24" }}
        >
          <Flex
            flexDirection="column"
            gap={{ base: "6", sm: "8" }}
            w="full"
            maxW="lg"
            mx="auto"
          >
            <Text
              fontWeight="semibold"
              fontSize="2xl"
              color="gray.600"
              textAlign="center"
            >
              Oops,{" "}
              <Box as="span" whiteSpace="nowrap">
                Đã có lỗi xảy ra!
              </Box>
            </Text>
            <Button
              type="button"
              onClick={() => this.setState({ hasError: false })}
            >
              Thử lại?
            </Button>
          </Flex>
        </Flex>
      );
    }

    // Return children components in case of no error

    return this.props.children;
  }
}

export default ErrorBoundary;
