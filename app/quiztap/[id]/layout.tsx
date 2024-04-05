import { FC, PropsWithChildren } from "react";

import "./styles.scss";
import Header from "./components/header";
import { fetchQuizApi } from "@/utils/api";
import QuizContextProvider from "@/context/quizProvider";
import QuizTapSidebar from "./components/sidebar";

const QuizLayout: FC<PropsWithChildren & { params: { id: string } }> = async ({
  children,
  params,
}) => {
  const quiz = await fetchQuizApi(Number(params.id));

  return (
    <QuizContextProvider quiz={quiz}>
      <Header />

      <div className="mt-5 flex flex-col gap-2 md:flex-row">
        {children}

        <QuizTapSidebar />
      </div>
    </QuizContextProvider>
  );
};

export default QuizLayout;
