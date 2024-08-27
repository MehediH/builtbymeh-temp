import Image from "next/image";
import ThemeSwitch from "@/components/theme-switch";
import { generalData } from "@/data/general";
import { contentData } from "@/data/content";
import type { Content } from "@/data/content";

type ContentProps = Content;

const Content: React.FC<ContentProps> = ({ title, items }) => {
  return (
    <section className="my-14 text-sm">
      <h3 className="mb-6 text-base font-medium underline underline-offset-2">
        {title}
      </h3>
      <div className="flex flex-col gap-6">
        {items.map((item, index) => {
          return (
            <div className="flex" key={index}>
              <div className="mr-8 max-w-[100px] w-full text-slate-400 dark:text-slate-300">
                {item.date}
              </div>
              <div className="flex flex-col flex-1">
                {item.link ? (
                  <a
                    href={item.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:underline inline-flex font-medium text-slate-700 dark:text-slate-100"
                  >
                    <h4 className="inline-flex">
                      {item.title}{" "}
                      {item.link ? (
                        <svg
                          width="12"
                          height="12"
                          viewBox="0 0 12 12"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M3.5 3C3.22386 3 3 3.22386 3 3.5C3 3.77614 3.22386 4 3.5 4V3ZM8.5 3.5H9C9 3.22386 8.77614 3 8.5 3V3.5ZM8 8.5C8 8.77614 8.22386 9 8.5 9C8.77614 9 9 8.77614 9 8.5H8ZM2.64645 8.64645C2.45118 8.84171 2.45118 9.15829 2.64645 9.35355C2.84171 9.54882 3.15829 9.54882 3.35355 9.35355L2.64645 8.64645ZM3.5 4H8.5V3H3.5V4ZM8 3.5V8.5H9V3.5H8ZM8.14645 3.14645L2.64645 8.64645L3.35355 9.35355L8.85355 3.85355L8.14645 3.14645Z"
                            className="fill-current text-slate-900 dark:text-slate-100"
                          ></path>
                        </svg>
                      ) : null}
                    </h4>
                  </a>
                ) : (
                  <h4 className="font-medium text-slate-700 dark:text-slate-100">
                    {item.title}
                  </h4>
                )}
                <p className="text-slate-600 dark:text-gray-400">
                  {item.subTitle}
                </p>
                {item.description ? (
                  <p className="text-slate-600 dark:text-gray-400 mt-2">
                    {item.description}
                  </p>
                ) : null}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default function Home() {
  return (
    <>
      <main className="max-w-xl mx-auto px-6 py-20 relative min-h-screen font-light">
        <section className="flex items-center">
          <Image
            alt="Author"
            src={generalData.avatar}
            width={140}
            height={140}
            draggable={false}
            className="rounded-full object-cover select-none"
          />
          <div className="ml-8">
            <h1 className="mb-0.5 text-2xl text-slate-900 dark:text-slate-100">
              {generalData.name}
            </h1>
            <p className="text-slate-600 dark:text-slate-300 text-lg">
              {generalData.jobTitle} in london
            </p>
            {generalData.website ? (
              <span className="text-sm text-slate-400 dark:text-slate-400">
                <a
                  href={generalData.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline"
                >
                  {generalData.website
                    .replace(/(^\w+:|^)\/\//, "")
                    .replace("www.", "")}
                </a>
              </span>
            ) : null}
          </div>
        </section>
        <section className="my-9 text-lg">
          <div className="text-slate-600 dark:text-slate-300">
            <p>
              hey! i am mehedi - a software engineer who loves simplicity and
              building fun products. this is a temporary site, you can find{" "}
              <a
                href="https://old.builtbymeh.com"
                target="_blank"
                className="transition-colors hover:text-blue-500 text-blue-600 dark:text-slate-50/60 dark:hover:text-slate-50 hover:underline hover:underline-offset-4"
              >
                my old site here
              </a>{" "}
              - it has a bit more personality. i am currently working on a new
              site - stay tuned!
            </p>
          </div>
        </section>
        {contentData.map((content, index) => {
          return <Content {...content} key={index} />;
        })}
        <section className="my-14 text-sm">
          <h3 className="mb-6 text-base font-medium underline underline-offset-2">
            Find me elsewhere
          </h3>
          <div className="flex flex-col gap-6">
            {generalData.contacts.map((contact, index) => {
              return (
                <div className="flex" key={index}>
                  <div className="mr-8 max-w-[100px] w-full text-slate-400 dark:text-slate-400">
                    {contact.label}
                  </div>
                  <div className="flex flex-col flex-1 text-slate-900 dark:text-slate-100">
                    <a
                      href={contact.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:underline inline-flex"
                    >
                      {contact.value}
                      <svg
                        width="12"
                        height="12"
                        viewBox="0 0 12 12"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M3.5 3C3.22386 3 3 3.22386 3 3.5C3 3.77614 3.22386 4 3.5 4V3ZM8.5 3.5H9C9 3.22386 8.77614 3 8.5 3V3.5ZM8 8.5C8 8.77614 8.22386 9 8.5 9C8.77614 9 9 8.77614 9 8.5H8ZM2.64645 8.64645C2.45118 8.84171 2.45118 9.15829 2.64645 9.35355C2.84171 9.54882 3.15829 9.54882 3.35355 9.35355L2.64645 8.64645ZM3.5 4H8.5V3H3.5V4ZM8 3.5V8.5H9V3.5H8ZM8.14645 3.14645L2.64645 8.64645L3.35355 9.35355L8.85355 3.85355L8.14645 3.14645Z"
                          className="fill-current text-slate-900 dark:text-slate-100"
                        ></path>
                      </svg>
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
        <div className="px-6 fixed left-0 bottom-6 lg:block hidden opacity-40 hover:opacity-100 transition-all">
          <ThemeSwitch />
        </div>
      </main>
    </>
  );
}
