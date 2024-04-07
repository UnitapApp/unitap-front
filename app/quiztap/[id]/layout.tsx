import { FC, PropsWithChildren } from "react";

import "./styles.scss";
import Header from "./components/header";
import { fetchQuizApi, fetchUserQuizEnrollment } from "@/utils/api";
import QuizContextProvider from "@/context/quizProvider";
import QuizTapSidebar from "./components/sidebar";
import { cookies } from "next/headers";

const QuizLayout: FC<PropsWithChildren & { params: { id: string } }> = async ({
  children,
  params,
}) => {
  const cookieStorage = cookies();

  const quiz = await fetchQuizApi(Number(params.id));

  const enrollmentPk = await fetchUserQuizEnrollment(
    cookieStorage.get("userToken")?.value!,
    Number(params.id),
  );

  return (
    <QuizContextProvider quiz={quiz} userEnrollmentPk={enrollmentPk}>
      <Header />

      <div className="mt-5 flex flex-col gap-2 md:flex-row">
        {children}

        <QuizTapSidebar />
      </div>
    </QuizContextProvider>
  );
};

export default QuizLayout;
