import { usePrizeOfferFormContext } from "@/context/providerDashboardContext";
import { ErrorProps } from "@/types";

interface PeopleLimitationProp {
  showErrors: ErrorProps | null;
}

const PeopleLimitation = ({ showErrors }: PeopleLimitationProp) => {
  const { data, handleChange, isShowingDetails } = usePrizeOfferFormContext();
  return (
    <div className="text-gray80 text-[12px] w-full max-w-[452px] relative mt-[-2px] ">
      <div
        className={`border ${
          showErrors && !showErrors.maximumLimitationStatus
            ? "border-error"
            : "border-gray50"
        }  h-[43px] rounded-xl px-3 bg-gray40 `}
      >
        <input
          type="text"
          placeholder="Maximum Number of enrollments (Optional)"
          className="provider-dashboard-input"
          name="maxNumberOfEntries"
          min={1}
          step={1}
          inputMode="numeric"
          onChange={handleChange}
          value={data.maxNumberOfEntries ? data.maxNumberOfEntries : ""}
          disabled={isShowingDetails}
          pattern="[0-9]"
        />
      </div>
      {showErrors && !showErrors.maximumLimitationStatus && (
        <p className="text-error text-[10px] m-0 p-0 absolute left-1 mt-1">
          {showErrors?.maximumLimitationMessage}
        </p>
      )}
    </div>
  );
};

export default PeopleLimitation;
