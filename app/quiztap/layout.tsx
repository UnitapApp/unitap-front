import { Metadata } from "next"
import { FC, PropsWithChildren } from "react"

export const metadata: Metadata = {
	title: "Unitap | Quiz Tap",
	description: "",
}

const PassLayout: FC<PropsWithChildren> = ({ children }) => {
	return <>{children}</>
}

export default PassLayout
