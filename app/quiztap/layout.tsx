import { FC, PropsWithChildren } from "react";
import { Metadata } from "next";

import "./styles.scss";

export const metadata: Metadata = {
  title: "Unitap | Quiz Tap ❓❔",
  description: "",
};

const QuizListLayout: FC<PropsWithChildren> = ({ children }) => {
  return <>{children}</>;
};

export default QuizListLayout;
