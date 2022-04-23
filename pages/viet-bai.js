import { mainAPI } from "utils/axios";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Editor from "components/editor";
import { useRef } from "react";

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
        alert(error);
      });
  };

  return (
    <>
      <div className="w-full max-w-screen-sm px-16 md:px-0 md:mx-auto">
        <div className="flex flex-col gap-12 py-32">
          <div className="flex items-center gap-12 text-gray-400 hover:text-gray-600">
            <button className="text-xl" onClick={() => router.back()}>
              &larr;
            </button>
          </div>
          <div className="flex items-center justify-between mb-24">
            <h1 className="mt-0 text-2xl font-semibold text-gray-600 text-heading">
              Tạo bài viết mới
            </h1>
            <button
              className="px-16 py-8 text-white rounded bg-rose-300 hover:bg-rose-400 disabled:cursor-not-allowed"
              disabled={!title || !content}
              onClick={handlePost}
            >
              Đăng bài
            </button>
          </div>
          <input
            className="w-full px-16 py-8 border rounded-lg"
            placeholder="Tiêu đề bài viết"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          {(!content || content === "\\\n") && (
            <div>
              <input
                ref={uploadInputRef}
                type="file"
                accept="text/plain, text/markdown"
                className="hidden"
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
                <input
                  className="w-full px-16 py-8 mb-10 border rounded-lg"
                  placeholder="https://example.com/duong-dan-den-file-markdown.md"
                  value={importURL}
                  onChange={(e) => setImportURL(e.target.value)}
                />
              )}
              <div className="space-x-4 text-sm text-gray-500">
                <span>Bạn đã có bài viết?</span>
                <button
                  className="underline"
                  onClick={() => uploadInputRef.current.click()}
                >
                  upload
                </button>
                <span>hoặc</span>
                <button
                  className="underline"
                  onClick={() => setIsImport((value) => !value)}
                >
                  import
                </button>
                <span>file của bạn.</span>
                <span>(chỉ hỗ trợ định dạng markdown)</span>
              </div>
            </div>
          )}
          <div className="pb-32 mt-16 space-y-16 leading-relaxed text-gray-900 md:text-lg md:space-y-24">
            {isImporting ? (
              <div>loading...</div>
            ) : (
              <Editor
                placeholder={"Viết điều gì đó..."}
                defaultValue={defaultContent}
                onChange={(value) => setContent(value)}
              />
            )}
          </div>
        </div>
      </div>
    </>
  );
}
