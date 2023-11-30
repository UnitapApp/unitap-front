"use client"

import { AppProgressBar as ProgressBar } from "next-nprogress-bar"

const Progressbar = () => (
  <ProgressBar height="4px" options={{ showSpinner: false }} shallowRouting />
)

export default Progressbar
