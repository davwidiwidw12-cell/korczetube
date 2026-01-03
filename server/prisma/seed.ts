import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const password = await bcrypt.hash('admin123', 10);

  const admin = await prisma.user.upsert({
    where: { email: 'korcze@korczetube.com' },
    update: {},
    create: {
      email: 'korcze@korczetube.com',
      name: 'Korcze',
      password,
      role: 'ADMIN',
    },
  });

  console.log({ admin });

  const video1 = await prisma.video.upsert({
    where: { slug: 'big-buck-bunny' },
    update: {},
    create: {
      title: 'Big Buck Bunny',
      description: 'A large and lovable rabbit deals with three tiny bullies, led by a flying squirrel, who are determined to squelch his happiness.',
      videoUrl: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
      thumbnailUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/Big_buck_bunny_poster_big.jpg/800px-Big_buck_bunny_poster_big.jpg',
      tags: 'animation,bunny,funny',
      slug: 'big-buck-bunny',
      isPublic: true,
      uploaderId: admin.id,
      views: 1024,
    },
  });

  const video2 = await prisma.video.upsert({
    where: { slug: 'elephant-dream' },
    update: {},
    create: {
      title: 'Elephant Dream',
      description: 'The first open movie from Blender Foundation.',
      videoUrl: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
      thumbnailUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0c/Elephants_Dream_poster.jpg/800px-Elephants_Dream_poster.jpg',
      tags: 'scifi,blender,movie',
      slug: 'elephant-dream',
      isPublic: true,
      uploaderId: admin.id,
      views: 512,
    },
  });

  const video3 = await prisma.video.upsert({
    where: { slug: 'sintel' },
    update: {},
    create: {
      title: 'Sintel',
      description: 'A lonely young woman, Sintel, helps and befriends a dragon, whom she calls Scales.',
      videoUrl: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4',
      thumbnailUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8f/Sintel_poster.jpg/800px-Sintel_poster.jpg',
      tags: 'fantasy,dragon,epic',
      slug: 'sintel',
      isPublic: true,
      uploaderId: admin.id,
      views: 2048,
    },
  });

  console.log({ video1, video2, video3 });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
