export const contentData = [
  {
    title: "Work Experience",
    items: [
      {
        title: "Causaly",
        subTitle: "Software Engineer",
        date: "2023 - present",
        description: "working as a full-stack engineer on a new AI Reports product that reduces a manual workflow for scientists in big pharma companies from 2-3 days to just 3-5 minutes. built an advanced pipeline for automating our E2E testing pipeline, and also building an internal design system.",
        labels: ["typescript (fp-ts)", "react", "graphql", "postgres", "elastic search", "redis", "gcp", "docker"]
      },
      {
        title: "Circle",
        subTitle: "Software Engineer II",
        date: "2021 - 2023",
        description: "built a bunch of cool products to enable faster, wider access to USDC for all businesses in the world, regardless of their location.",
        labels: ["typescript", "java", "react", "graphql", "postgres"]
      },
      {
        title: "Qualcomm",
        subTitle: "Software Engineering Intern",
        date: "2020",
        description: "worked in the Windows on Snapdragon team, building a hardware tuning app with C++ to enable system engineers to stress test, monitor, identify, and mitigate overheating issues across an SoC — reducing CPU usage of the app by 60%.",
        labels: ["c++", "c#", "win32", "electron"]
      },
    ],
  },
  {
    title: "Projects",
    items: [
      {
        title: "movienight",
        subTitle: "a comments section for netflix, think soundcloud comments for your favorite shows and movies.",
        date: "2023",
        link: "https://getmovienight.app/",
        labels: ["react native", "postgres", "typescript"]
      },
      {
        title: "sandman",
        subTitle: "test your type speed by writing the lyrics of your favorite songs",
        date: "2022",
        link: "https://sandman.vercel.app/",
        labels: ["react", "typescript"]
      },
      {
        title: "m3tamorphosis",
        subTitle: "a very cool 3d spotify player built with three.js and react",
        date: "2022",
        link: "https://m3tamorphosis.vercel.app/",
        labels: ["react", "three.js", "typescript"]
      },
      {
        title: "tweeten",
        subTitle: "a cross-platform twitter client built for powerusers with electron",
        date: "2016-2022",
        link: "https://tweetenapp.com",
        labels: ["electron", "react", "typescript"]
      },
      {
        title: "winstall",
        subTitle: "a web app for finding apps available with the windows package manager (now sold).",
        date: "2021",
        link: "https://winstall.app/",
        labels: ["react", "mongodb", "typescript"]
      },
      {
        title: "social distance drawing",
        subTitle: "a fun little covid project where you can draw with friends in a real-time, socially distanced manner.",
        date: "2021",
        link: "https://old.builtbymeh.com/projects/social-distance-drawing",
        labels: ["jquery (for real)", "node", "socket.io"]
      },
      {
        title: "gitcleanup",
        subTitle: "webapp for deleting all your abandoned github repos in one click.",
        date: "2020",
        link: "https://github.com/MehediH/gitcleanup",
        labels: ["react", "typescript"]
      },
      {
        title: "gitgat",
        subTitle: "cli for automatically generating .gitignore",
        date: "2020",
        link: "https://github.com/MehediH/gitgat",
      },
      {
        title: "bulksplash",
        subTitle: "cli for bulk downloading images from unsplash.",
        date: "2018",
        link: "https://github.com/MehediH/Bulksplash",
      },
     
    ],
  },
];

export type Content = {
  title: string;
  items: {
    title: string;
    subTitle: string;
    date: string;
    description?: string;
    link?: string;
    labels?: string[]
  }[];
};

export type ContentData = Content[];
