// Theme configuration for the entire application
// This allows for centralized color management and easy theme changes

export const theme = {
  // Common colors
  background: {
    page: "bg-slate-50",
    card: "bg-slate-800",
    input: "bg-slate-900",
  },
  text: {
    primary: "text-white",
    secondary: "text-slate-400",
  },
  border: {
    input: "border-slate-700",
  },

  // Trading specific colors
  trading: {
    buy: {
      primary: "bg-emerald-500",
      hover: "hover:bg-emerald-600",
      text: "text-emerald-400",
    },
    sell: {
      primary: "bg-rose-700",
      hover: "hover:bg-rose-800",
      text: "text-rose-400",
    },
  },
};

// Helper function to get the appropriate color based on trading mode
export const getTradingColor = (
  mode: "buy" | "sell",
  type: "primary" | "hover" | "text"
) => {
  return theme.trading[mode][type];
};
