import { prisma } from "@/lib/prisma";

export async function getPosts() {
  return await prisma.post.findMany({
    where: { published: true },
    include: {
      author: {
        select: {
          name: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}

// データベースから記事一記事分だけを取得する
export async function getPost(id: string) {
  return await prisma.post.findUnique({
    where: { id },
    include: {
      author: {
        select: {
          name: true,
        },
      },
    },
  });
}

export async function searchPosts(search: string) {
  const decodedSearch = decodeURIComponent(search);
  const normalizedSearch = decodedSearch.replace(/[\s　]+/g, " ").trim();
  const searchWords = normalizedSearch.split(" ").filter(Boolean);

  const filters = searchWords.map((word) => ({
    OR: [{ title: { contains: word } }, { content: { contains: word } }],
  }));

  return await prisma.post.findMany({
    where: {
      // AND条件とは複数の意味
      AND: filters,
    },
    include: {
      author: {
        select: {
          name: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}
