import { DollarSign, ExternalLink, Calculator } from "lucide-react";
import { useState } from "react";
import { getPermitFeeEstimate, PERMIT_FEES } from "@/data/permitFees";
import { JobType } from "@/types";

interface FeeEstimateProps {
  jobType: JobType;
  jurisdictionId?: string;
  projectValue?: number;
  squareFeet?: number;
}

export default function FeeEstimate({ 
  jobType, 
  jurisdictionId = "st-petersburg",
  projectValue,
  squareFeet 
}: FeeEstimateProps) {
  const [showCalculator, setShowCalculator] = useState(false);
  const [calcProjectValue, setCalcProjectValue] = useState(projectValue || 0);
  const [calcSquareFeet, setCalcSquareFeet] = useState(squareFeet || 0);
  
  const feeInfo = PERMIT_FEES.find(
    f => f.jobType === jobType && f.jurisdictionId === jurisdictionId
  );
  
  const estimate = getPermitFeeEstimate(
    jobType, 
    jurisdictionId, 
    calcProjectValue || undefined,
    calcSquareFeet || undefined
  );
  
  if (!estimate) {
    return (
      <div className="bg-muted rounded-lg p-4">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-lg bg-yellow-500/10 flex items-center justify-center flex-shrink-0">
            <DollarSign size={20} className="text-yellow-600" />
          </div>
          <div className="flex-1">
            <h3 className="text-sm font-semibold text-foreground mb-1">
              Permit Fee Information
            </h3>
            <p className="text-xs text-muted-foreground mb-2">
              Contact your local building department for current fee information.
            </p>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 rounded-lg p-4 border border-green-200 dark:border-green-800">
      <div className="flex items-start gap-3 mb-3">
        <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center flex-shrink-0">
          <DollarSign size={20} className="text-green-600 dark:text-green-400" />
        </div>
        <div className="flex-1">
          <h3 className="text-sm font-semibold text-foreground mb-1">
            Estimated Permit Fees
          </h3>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-green-600 dark:text-green-400">
              ${estimate.min}
            </span>
            {estimate.max !== estimate.min && (
              <>
                <span className="text-muted-foreground">to</span>
                <span className="text-2xl font-bold text-green-600 dark:text-green-400">
                  ${estimate.max}
                </span>
              </>
            )}
          </div>
          {estimate.calculated && (
            <p className="text-xs text-green-700 dark:text-green-300 mt-1">
              Based on your project value: <strong>${Math.round(estimate.calculated)}</strong>
            </p>
          )}
          <p className="text-xs text-muted-foreground mt-1">
            {feeInfo?.baselineRange.notes}
          </p>
        </div>
      </div>
      
      {/* Fee Calculator */}
      {feeInfo?.calculator && (
        <div className="mt-3 pt-3 border-t border-green-200 dark:border-green-800">
          <button
            onClick={() => setShowCalculator(!showCalculator)}
            className="flex items-center gap-2 text-xs font-medium text-green-700 dark:text-green-300 hover:text-green-800 dark:hover:text-green-200"
          >
            <Calculator size={14} />
            {showCalculator ? "Hide" : "Show"} Fee Calculator
          </button>
          
          {showCalculator && (
            <div className="mt-3 space-y-2">
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1">
                  Estimated Project Value ($)
                </label>
                <input
                  type="number"
                  value={calcProjectValue || ""}
                  onChange={(e) => setCalcProjectValue(parseFloat(e.target.value) || 0)}
                  placeholder="10000"
                  className="w-full px-3 py-2 bg-white dark:bg-gray-800 rounded-lg text-sm text-foreground border border-green-300 dark:border-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
              {feeInfo.calculator.formula.includes("sq_ft") && (
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1">
                    Square Footage
                  </label>
                  <input
                    type="number"
                    value={calcSquareFeet || ""}
                    onChange={(e) => setCalcSquareFeet(parseFloat(e.target.value) || 0)}
                    placeholder="1500"
                    className="w-full px-3 py-2 bg-white dark:bg-gray-800 rounded-lg text-sm text-foreground border border-green-300 dark:border-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
              )}
              <p className="text-xs text-muted-foreground italic">
                Formula: {feeInfo.calculator.description}
              </p>
            </div>
          )}
        </div>
      )}
      
      {/* Official Schedule Link */}
      {feeInfo?.officialScheduleUrl && (
        <div className="mt-3 pt-3 border-t border-green-200 dark:border-green-800">
          <a
            href={feeInfo.officialScheduleUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-xs font-medium text-green-700 dark:text-green-300 hover:text-green-800 dark:hover:text-green-200"
          >
            <ExternalLink size={14} />
            View Official Fee Schedule
          </a>
          <p className="text-xs text-muted-foreground mt-1">
            Last updated: {feeInfo.lastUpdated}
          </p>
        </div>
      )}
      
      {/* Disclaimer */}
      <div className="mt-3 pt-3 border-t border-green-200 dark:border-green-800">
        <p className="text-xs text-muted-foreground">
          ⚠️ <strong>Estimates only.</strong> Actual fees may vary. Always confirm with your local building department before beginning work.
        </p>
      </div>
    </div>
  );
}
