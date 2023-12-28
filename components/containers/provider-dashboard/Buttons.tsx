import { Button } from "@/components/ui/Button/button";
import { DV } from "@/components/ui/designVariables";
import styled from "styled-components";

export const PrimaryBackToHomedButton = styled(Button)`
  background: ${({ disabled }) =>
    disabled ? DV.bgGradient.primary : DV.bgGradient.primary};
  position: relative;
  z-index: 1;
  &::before {
    content: "";
    display: block;
    z-index: -1;
    position: absolute;
    background: ${DV.bgGradient.dark};
    inset: 0;
    margin: 0.1rem;
    border-radius: 6px;
  }
`;

export const BackToHomeButton = styled(PrimaryBackToHomedButton)`
  font-weight: 500;
  border-radius: 8px;
  &:not(:disabled) p {
    background: ${DV.bgGradient.primary};
    -webkit-background-clip: text;
    -webkit-text-fill-color: white;
  }

  ::before {
    background: ${DV.colors.gray20} !important;
  }

  &:disabled {
    opacity: 0.6;
    border: 2px solid ${DV.colors.gray80};

    background: transparent;

    p {
      -webkit-background-clip: none !important;
      -webkit-text-fill-color: none !important;
      color: white;
    }

    ::before {
      background: none !important;
    }
  }
`;

export const PrimaryOutlinedButtonDashboardVerifying = styled(Button)`
  /* border: 1px solid ${DV.colors.primary}; */
  color: ${({ disabled }) => (disabled ? "#C0AFC7" : DV.colors.gray100)};
  background: ${({ disabled }) => (disabled ? "#C0AFC7" : DV.colors.gray70)};
  position: relative;
  z-index: 1;

  &::before {
    content: "";
    display: block;
    z-index: -1;
    position: absolute;
    background: ${DV.colors.gray50};
    inset: 0;
    margin: 1px;
    border-radius: 5px;
  }
`;

export const ProviderDashboardButtonVerifying = styled(
  PrimaryOutlinedButtonDashboardVerifying
)`
  width: 100%;
  padding: 0px 5.3em;
  font-weight: 500;
  height: 24px;
  max-width: 100px;
  font-size: 10px;
  border-radius: 6px;
  &:not(:disabled) p {
    background: ${DV.colors.space_green};
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }

  ::before {
    // background: ${DV.colors.gray50} !important;
  }

  &:disabled {
    opacity: 0.6;

    background: ${DV.colors.gray50};

    p {
      -webkit-background-clip: none !important;
      -webkit-text-fill-color: none !important;
      color: ${DV.colors.gray100};
    }

    ::before {
      background: none !important;
    }
  }
`;

export const PrimaryOutlinedButtonDashboardNext = styled(Button)`
  /* border: 1px solid ${DV.colors.primary}; */
  color: ${({ disabled }) => (disabled ? "#C0AFC7" : DV.colors.space_green)};
  background: ${({ disabled }) =>
    disabled ? "#C0AFC7" : DV.colors.space_green};
  position: relative;
  z-index: 1;

  &::before {
    content: "";
    display: block;
    z-index: -1;
    position: absolute;
    background: ${DV.colors.darkgreen};
    inset: 0;
    margin: 2px;
    border-radius: 10px;
  }
`;

export const ProviderDashboardButtonNext = styled(
  PrimaryOutlinedButtonDashboardNext
)`
  width: 100%;
  // padding: 0px 5.3em;
  font-weight: 500;
  height: 44px;
  font-size: 14px;
  border-radius: 12px;
  &:not(:disabled) p {
    background: ${DV.colors.space_green};
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }

  ::before {
    // background: ${DV.colors.gray50} !important;
  }

  &:disabled {
    opacity: 0.6;

    background: ${DV.colors.darkgreen};

    p {
      -webkit-background-clip: none !important;
      -webkit-text-fill-color: none !important;
      color: ${DV.colors.gray10};
    }

    ::before {
      background: none !important;
    }
  }
`;

export const PrimaryOutlinedButtonGoToDashboard = styled(Button)`
  /* border: 1px solid ${DV.colors.primary}; */
  color: ${({ disabled }) => (disabled ? "#C0AFC7" : DV.colors.space_green)};
  background: ${({ disabled }) =>
    disabled ? "#C0AFC7" : DV.colors.space_green};
  position: relative;
  z-index: 1;

  &::before {
    content: "";
    display: block;
    z-index: -1;
    position: absolute;
    background: ${DV.colors.darkgreen};
    inset: 0;
    margin: 2px;
    border-radius: 10px;
  }
`;

export const ProviderDashboardGoToDashBoard = styled(
  PrimaryOutlinedButtonGoToDashboard
)`
  width: 100%;
  //padding: 0px 5.3em;
  font-weight: 700;
  height: 44px;
  font-size: 14px;
  border-radius: 12px;
  &:not(:disabled) p {
    background: ${DV.colors.space_green};
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }

  ::before {
    // background: ${DV.colors.gray50} !important;
  }

  &:disabled {
    opacity: 0.6;

    background: ${DV.colors.darkgreen};

    p {
      -webkit-background-clip: none !important;
      -webkit-text-fill-color: none !important;
      color: ${DV.colors.gray10};
    }

    ::before {
      background: none !important;
    }
  }
`;

export const PrimaryOutlinedButtonDashboardPrevious = styled(Button)`
  color: ${({ disabled }) => (disabled ? DV.colors.gray40 : DV.colors.gray90)};
  background: ${({ disabled }) =>
    disabled ? DV.colors.gray50 : DV.colors.gray50};
  position: relative;
  z-index: 1;

  &::before {
    content: "";
    display: block;
    z-index: -1;
    position: absolute;
    background: ${DV.colors.gray30};
    inset: 0;
    margin: 2px;
    border-radius: 10px;
  }
`;

export const ProviderDashboardButtonPrevious = styled(
  PrimaryOutlinedButtonDashboardPrevious
)`
  width: 100%;
  // padding: 0px 5.3em;
  font-weight: 500;
  height: 44px;
  font-size: 14px;
  border-radius: 12px;
  &:not(:disabled) p {
    background: ${DV.colors.gray90};
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }

  ::before {
    // background: ${DV.colors.gray50} !important;
  }

  &:disabled {
    opacity: 0.6;

    background: ${DV.colors.gray20};
    border: 2px solid ${DV.colors.gray50};

    p {
      -webkit-background-clip: none !important;
      -webkit-text-fill-color: none !important;
      color: ${DV.colors.gray40};
    }

    ::before {
      background: none !important;
    }
  }
`;

export const PrimaryOutlinedButtonDashboardRejected = styled(Button)`
  /* border: 1px solid ${DV.colors.primary}; */
  color: ${({ disabled }) => (disabled ? "#C0AFC7" : DV.colors.warningRed)};
  background: ${({ disabled }) =>
    disabled ? "#C0AFC7" : DV.colors.warningRed};
  position: relative;
  z-index: 1;

  &::before {
    content: "";
    display: block;
    z-index: -1;
    position: absolute;
    background: ${DV.colors.DarkWarningRed};
    inset: 0;
    margin: 1px;
    border-radius: 5px;
  }
`;

export const ProviderDashboardButtonRejected = styled(
  PrimaryOutlinedButtonDashboardRejected
)`
  width: 100%;
  padding: 0px 5.3em;
  font-weight: 500;
  height: 24px;
  max-width: 100px;
  font-size: 10px;
  border-radius: 6px;
  &:not(:disabled) p {
    background: ${DV.colors.warningRed};
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }

  ::before {
    // background: ${DV.colors.gray50} !important;
  }

  &:disabled {
    opacity: 0.6;

    background: ${DV.colors.DarkWarningRed};

    p {
      -webkit-background-clip: none !important;
      -webkit-text-fill-color: none !important;
      color: ${DV.colors.warningRed};
    }

    ::before {
      background: none !important;
    }
  }
`;

export const PrimaryOutlinedButtonDashboardCheck = styled(Button)`
  /* border: 1px solid ${DV.colors.primary}; */
  color: ${({ disabled }) => (disabled ? "#C0AFC7" : DV.colors.warningRed)};
  background: ${({ disabled }) =>
    disabled ? "#C0AFC7" : DV.colors.warningRed};
  position: relative;
  z-index: 1;

  &::before {
    content: "";
    display: block;
    z-index: -1;
    position: absolute;
    background: #212130;
    inset: 0;
    margin: 1px;
    border-radius: 12px;
  }
`;

export const ProviderDashboardButtonCheck = styled(
  PrimaryOutlinedButtonDashboardCheck
)`
  font-size: 10px;
  width: 100%;
  padding: 0px 5.3em;
  font-weight: 600;
  height: 48px;
  font-size: 10px;
  border-radius: 12px;
  &:not(:disabled) p {
    background: ${DV.colors.dark};
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }

  ::before {
    // background: ${DV.colors.gray50} !important;
  }

  &:disabled {
    opacity: 0.6;

    background: ${DV.colors.dark};

    p {
      -webkit-background-clip: none !important;
      -webkit-text-fill-color: none !important;
      color: ${DV.colors.warningRed};
    }

    ::before {
      background: none !important;
    }
  }
`;

export const PrimaryOutlinedButtonDashboardShowDetails = styled(Button)`
  /* border: 1px solid ${DV.colors.primary}; */
  color: ${({ disabled }) => (disabled ? "#C0AFC7" : DV.colors.gray100)};
  background: ${({ disabled }) => (disabled ? "#C0AFC7" : DV.colors.gray70)};
  position: relative;
  z-index: 1;

  &::before {
    content: "";
    display: block;
    z-index: -1;
    position: absolute;
    background: #212130;
    inset: 0;
    margin: 1px;
    border-radius: 12px;
  }
`;

export const ProviderDashboardButtonShowDetails = styled(
  PrimaryOutlinedButtonDashboardShowDetails
)`
  font-size: 10px;
  width: 100%;
  padding: 0px 5.3em;
  font-weight: 600;
  height: 48px;
  font-size: 10px;
  border-radius: 12px;
  &:not(:disabled) p {
    background: ${DV.colors.dark};
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }

  ::before {
    // background: ${DV.colors.gray50} !important;
  }

  &:disabled {
    opacity: 0.6;

    background: ${DV.colors.dark};

    p {
      -webkit-background-clip: none !important;
      -webkit-text-fill-color: none !important;
      color: ${DV.colors.gray100};
    }

    ::before {
      background: none !important;
    }
  }
`;

export const NoCurrencyButton = styled(Button)`
  background: ${DV.colors.gray90};
  color: ${DV.colors.gray70};
  width: 220px;
`;

export const PrimaryOutlinedButtonDashboard = styled(Button)`
  /* border: 1px solid ${DV.colors.primary}; */
  color: ${({ disabled }) => (disabled ? "#C0AFC7" : "white")};
  background: ${({ disabled }) =>
    disabled ? "#C0AFC7" : DV.bgGradient.primary};
  position: relative;
  z-index: 1;

  &::before {
    content: "";
    display: block;
    z-index: -1;
    position: absolute;
    background: #212130;
    inset: 0;
    margin: 1px;
    border-radius: 5px;
  }
`;

export const ProviderDashboardButton = styled(PrimaryOutlinedButtonDashboard)`
  width: 100%;
  padding: 0px 5.3em;
  font-weight: 500;
  height: 24px;
  max-width: 100px;
  font-size: 10px;
  border-radius: 6px;
  &:not(:disabled) p {
    background: ${DV.bgGradient.primary};
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }

  ::before {
    // background: ${DV.colors.gray50} !important;
  }

  &:disabled {
    opacity: 0.6;

    background: ${DV.colors.gary50};

    p {
      -webkit-background-clip: none !important;
      -webkit-text-fill-color: none !important;
      color: ${DV.colors.gray10};
    }

    ::before {
      background: none !important;
    }
  }
`;

export const PrimaryOutlinedButtonDashboardSubmit = styled(Button)`
  background: ${DV.bgGradient.primary};
  position: relative;
  z-index: 1;

  &::before {
    content: "";
    display: block;
    z-index: -1;
    position: absolute;
    background: #0c0c17;
    inset: 0;
    margin: 2px;
    border-radius: 10px;
  }
`;

export const ProviderDashboardButtonSubmit = styled(
  PrimaryOutlinedButtonDashboardSubmit
)`
  font-weight: 700;
  width: 100%;
  white-space: nowrap;
  &:not(:disabled) p {
    background: ${DV.bgGradient.primary};
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }

  &:disabled {
    opacity: 0.5;

    p {
      background: ${DV.bgGradient.primary};
      -webkit-background-clip: text !important;
      -webkit-text-fill-color: transparent !important;
    }

    ::before {
      background: none !important;
    }
  }
`;

export const PrimaryOutlinedButtonDashboardSuccess = styled(Button)`
  /* border: 1px solid ${DV.colors.primary}; */
  color: ${({ disabled }) => (disabled ? "#C0AFC7" : DV.colors.space_green)};
  background: ${({ disabled }) =>
    disabled ? "#C0AFC7" : DV.colors.space_green};
  position: relative;
  z-index: 1;

  &::before {
    content: "";
    display: block;
    z-index: -1;
    position: absolute;
    background: ${DV.colors.darkgreen};
    inset: 0;
    margin: 1px;
    border-radius: 5px;
  }
`;

export const ProviderDashboardButtonSuccess = styled(
  PrimaryOutlinedButtonDashboardSuccess
)`
  width: 100%;
  padding: 0px 5.3em;
  font-weight: 500;
  height: 24px;
  max-width: 100px;
  font-size: 10px;
  border-radius: 6px;
  &:not(:disabled) p {
    background: ${DV.colors.space_green};
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }

  ::before {
    // background: ${DV.colors.gray50} !important;
  }

  &:disabled {
    opacity: 0.6;

    background: ${DV.colors.darkgreen};

    p {
      -webkit-background-clip: none !important;
      -webkit-text-fill-color: none !important;
      color: ${DV.colors.gray10};
    }

    ::before {
      background: none !important;
    }
  }
`;
