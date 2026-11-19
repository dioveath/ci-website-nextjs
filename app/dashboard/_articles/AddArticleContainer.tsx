'use client';

import { useState, useRef, useContext } from "react";
import Image from "next/image";
import dynamic from "next/dynamic";

import { useMutation } from "@tanstack/react-query";

import useAuth from '@/lib/auth';
import queryClient from '@/lib/queryClient';
import { pageContext } from "./index";
import { isEmptyDocument } from "@/lib/editor/serialize";
import MediaSelectModal from "../_media/MediaSelectModal";
import { ChevronLeft } from "lucide-react";
import type { Article, Media } from '@/types';
import type { TiptapEditorHandle } from '@/components/TiptapEditor';
import { removeMedia } from '@/lib/users';
import { createArticle, updateArticle } from '@/lib/articles';

const TiptapEditor = dynamic(() => import("@/components/TiptapEditor"), { ssr: false });

export default function AddArticleContainer({ article }: { article?: Article | null }) {
  const [title, setTitle] = useState<string | undefined>(article?.title);
  const [fieldError, setFieldError] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [thumbnail, setThumbnail] = useState<Media | null>(null);
  const [images, setImages] = useState<Media[]>([]);

  const { user } = useAuth();
  const isEdit = !!article;

  const editorCoreRef = useRef<TiptapEditorHandle | null>(null);

  const addMutation = useMutation({
    mutationFn: (newArticle: Partial<Article>) => {
      return createArticle(newArticle);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["articles"] });
    },
  });

  const updateMutation = useMutation({
    mutationFn: (changes: Partial<Article>) => {
      return updateArticle(article!.id, changes);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["articles"] });
    },
  });
  const mutation = isEdit ? updateMutation : addMutation;

  const clearEditorLeftoverImages = async () => {
    // Get editorJs images
    const currentImages: string[] = [];
    document
      .querySelectorAll<HTMLImageElement>(".ProseMirror img")
      .forEach((x) => currentImages.push(x.src));

    if (images.length > currentImages.length) {
        for (const img of images) {
            if (!currentImages.includes(img.downloadURL)) {
                try {
                  await removeMedia(user!.uid, img);
                  removeImage(img);
                } catch (err) {
                  console.error(err);
                }
            }
        }
    }
  };

  const removeImage = (img: Media) => {
    const array = images.filter((image) => image.uid !== img.uid);
    setImages(array);
  };

  const onAddClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    // save() is already async; the Promise wrapper only re-wrapped it.
    const rawContentState = (await editorCoreRef.current?.save()) ?? null;

    if (!title) {
      setFieldError("Title shoud be set!");
      return;
    }

    if (isEmptyDocument(rawContentState)) {
      setFieldError("Please add some content!");
      return;
    }


    clearEditorLeftoverImages();

    if (isEdit) {
      const articleData = {
        body: JSON.stringify(rawContentState),
        title: title,
        ...(thumbnail && {
          thumbnail: {
            id: thumbnail.uid,
            downloadURL: thumbnail.downloadURL,
          },
        }),
      };

      updateMutation.mutate(articleData);
    } else {
      if (!thumbnail) {
        setFieldError("Enter beautiful thumbnail!");
        return;
      }

      const articleData = {
        body: JSON.stringify(rawContentState),
        title: title,
        writtenBy: user!.uid,
        ...(thumbnail && {
          thumbnail: {
            id: thumbnail.uid,
            downloadURL: thumbnail.downloadURL,
          },
        }),
      };

      addMutation.mutate(articleData);
    }
  };

  const { setPage, setArticle } = useContext(pageContext);

  return (
    <div className="w-full">
      <div className="px-4">
        <p className="uppercase font-light text-3xl text-white">
          {isEdit ? "Edit" : "Add"} an article
        </p>
        <p className="font-light text-white"> {new Date().toDateString()} </p>
      </div>

      <div className="max-w-lg rounded-r-full bg-primary text-primary-foreground py-2 px-4 my-4">
        <p className="text-white text-xl font-light">
          {isEdit ? "Edit" : "Add"} an Article
        </p>
      </div>

      <button
        className="flex items-center text-white"
        onClick={() => {
          setPage(0);
          setArticle(null);
        }}
      >
        <ChevronLeft className="size-6" /> Back
      </button>

      <input
        onChange={(e) => {
          setTitle(e.target.value);
        }}
        value={title}
        name="title"
        type="text"
        placeholder="Article Title"
        className="w-full py-3 mt-4 px-4 rounded-lg outline-hidden shadow-sm"
      />

      {modalOpen && (
        <MediaSelectModal
          onClose={() => setModalOpen(false)}
          setSelect={(image: Media) => setThumbnail(image)}
        />
      )}
      <div className="flex flex-col items-center gap-2 my-4">
        {
          <Image
            alt="thumb upload"
            src={
              thumbnail
                ? thumbnail.downloadURL
                : isEdit
                ? article!.thumbnail?.downloadURL ?? "/upload.webp"
                : "/upload.webp"
            }
            width={320}
            height={200}
            className="object-cover"
          />
        }

        {!modalOpen && (
          <button
            className="w-full bg-primary py-3 text-primary-foreground font-light rounded-full hover:bg-primary/90 transition-all"
            onClick={() => setModalOpen(true)}
          >
            Select Thumbnail
          </button>
        )}
      </div>

      <div className="w-full h-full rounded-xl flex justify-center items-center bg-card">
        <div className="w-full h-full overflow-y-auto p-4 rounded-xl prose dark:prose-invert">
          {TiptapEditor && (
            <TiptapEditor
              userId={user!.uid}
              images={images}
              innerRef={editorCoreRef}
              data={isEdit ? JSON.parse(article!.body) : null}
            />
          )}
        </div>
      </div>

      <div className="py-4 px-4">
        {mutation.isError && (
          <p className="text-destructive text-xs italic">
            {mutation.error.message}
          </p>
        )}
        {mutation.isSuccess && (
          <p className="text-primary text-xs italic">
            Successfully {isEdit ? "Edited" : "Added"}
          </p>
        )}
        {fieldError && (
          <p className="text-destructive text-xs italic"> {fieldError}</p>
        )}
      </div>

      <button
        className={`text-primary-foreground bg-primary hover:bg-primary/90 disabled:bg-muted disabled:text-muted-foreground  
                          w-full py-4 mt-5 rounded-full shadow-md transition-all 
                          ${mutation.isPending ? "animate-pulse" : ""}`}
        onClick={onAddClick}
        disabled={mutation.isPending}
      >
        {isEdit ? "Edit" : "Submit"} Article
      </button>
    </div>
  );
}
