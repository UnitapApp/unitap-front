import Icon from "@/components/ui/Icon"
import { DV } from "@/components/ui/designVariables"
import styled from "styled-components"

type props = {
  editable?: boolean
  children?: React.ReactNode
  fontSize?: string
}

export const WalletAddressWrapper = styled.div<props>`
  padding: 0;
  margin: 0;
  background: #312335;
  border: 1px solid #9347ab;

  border-radius: ${DV.sizes.baseRadius * 1.5}px;
  text-align: center;
  color: white;
  box-sizing: border-box;
  width: 100%;
  margin-bottom: 1rem;
  padding: ${DV.sizes.basePadding * 1.4}px ${DV.sizes.basePadding * 3}px;

  font-weight: 700;
  font-size: ${(props) => props.fontSize || "14"}px;

  position: relative;

  .edit-icon {
    position: absolute;
    right: ${DV.sizes.basePadding * 3}px;
    bottom: ${DV.sizes.basePadding * 1.3}px;

    &:hover {
      cursor: pointer;
    }
  }
`

const WalletAddress = ({ editable, children, fontSize }: props) => (
  <WalletAddressWrapper fontSize={fontSize}>
    {children}
    {editable === true && (
      <Icon className="edit-icon" iconSrc={"edit.png"} width="16px" />
    )}
  </WalletAddressWrapper>
)

export default WalletAddress
