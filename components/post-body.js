import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github.css";
import {
  Box,
  Code,
  Divider,
  Link,
  ListItem,
  OrderedList,
  Table,
  TableCaption,
  Tbody,
  Td,
  Text,
  Tfoot,
  Th,
  Thead,
  Tr,
  UnorderedList,
} from "@chakra-ui/react";

const h2Render = ({ node, children, className, ...props }) => (
  <Box
    as="h3"
    fontWeight="bold"
    fontFamily="heading"
    fontSize={{ base: "xl", sm: "2xl" }}
    lineHeight="normal"
    color="gray.800"
    {...props}
  >
    {children}
  </Box>
);

const components = {
  a: ({ node, children, className, ...props }) => (
    <Link color="blue.600" textDecoration="underline" {...props}>
      {children}
    </Link>
  ),
  blockquote: ({ node, children, className, ...props }) => (
    <Box
      as="blockquote"
      borderLeft="4px"
      borderStyle="solid"
      borderColor="gray.300"
      px="5"
      color="gray.500"
      textDecoration="italic"
      {...props}
    >
      {children}
    </Box>
  ),
  pre: ({ node, children, className, ...props }) => (
    <Box
      as="pre"
      borderRadius="base"
      sx={{ "& > code": { w: "full", p: "4", overflowX: "auto" } }}
      {...props}
    >
      {children}
    </Box>
  ),
  code: ({ node, children, className, ...props }) => (
    <Code borderRadius="base" fontSize="sm" wordBreak="break-word" {...props}>
      {children}
    </Code>
  ),
  em: ({ node, children, className, ...props }) => (
    <em {...props}>{children}</em>
  ),
  strong: ({ node, children, className, ...props }) => (
    <Box as="strong" color="gray.700" {...props}>
      {children}
    </Box>
  ),
  h1: ({ node, children, className, ...props }) => (
    <Box
      as="h2"
      fontFamily="heading"
      fontWeight="extrabold"
      py={{ base: "1", sm: "2" }}
      fontSize={{ base: "2xl", sm: "3xl" }}
      color="gray.800"
      {...props}
    >
      {children}
    </Box>
  ),
  h2: h2Render,
  h3: h2Render,
  h4: h2Render,
  h5: h2Render,
  h6: h2Render,
  hr: ({ node, children, className, ...props }) => (
    <Divider {...props}>{children}</Divider>
  ),
  li: ({ node, children, className, ...props }) => (
    <ListItem
      sx={{ "& > *+*": { mt: "2" } }}
      fontSize={{ base: "xl", sm: "2xl" }}
      letterSpacing={{ sm: "-0.025em" }}
      lineHeight="taller"
      {...props}
    >
      {children}
    </ListItem>
  ),
  ol: ({ node, children, className, ...props }) => (
    <OrderedList
      spacing={{ base: "2", sm: "2.5" }}
      lineHeight={{ sm: "tall" }}
      {...props}
    >
      {children}
    </OrderedList>
  ),
  ul: ({ node, children, className, ...props }) => (
    <UnorderedList
      spacing={{ base: "2", sm: "2.5" }}
      lineHeight={{ sm: "tall" }}
      {...props}
    >
      {children}
    </UnorderedList>
  ),
  p: ({ node, children, className, ...props }) => (
    <Text
      fontSize={{ base: "xl", sm: "2xl" }}
      letterSpacing={{ sm: "-0.025em" }}
      lineHeight="taller"
      {...props}
    >
      {children}
    </Text>
  ),
  table: ({ node, children, className, ...props }) => (
    <Table {...props}>{children}</Table>
  ),
  caption: ({ node, children, className, ...props }) => (
    <TableCaption {...props}>{children}</TableCaption>
  ),
  thead: ({ node, children, className, ...props }) => (
    <Thead {...props}>{children}</Thead>
  ),
  tbody: ({ node, children, className, ...props }) => (
    <Tbody {...props}>{children}</Tbody>
  ),
  tfoot: ({ node, children, className, ...props }) => (
    <Tfoot {...props}>{children}</Tfoot>
  ),
  tr: ({ node, children, className, ...props }) => (
    <Tr {...props}>{children}</Tr>
  ),
  th: ({ node, children, className, ...props }) => (
    <Th {...props}>{children}</Th>
  ),
  td: ({ node, children, className, ...props }) => (
    <Td fontSize="sm" {...props}>
      {children}
    </Td>
  ),
};

export default function PostBody({ children }) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      rehypePlugins={[[rehypeHighlight, { ignoreMissing: true }]]}
      components={components}
    >
      {children}
    </ReactMarkdown>
  );
}
