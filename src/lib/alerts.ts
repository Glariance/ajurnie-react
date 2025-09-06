// src/lib/alerts.ts
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const MySwal = withReactContent(Swal);

const DARK_BG = "#111827";   // gray-900
const DARK_FG = "#E5E7EB";   // gray-200

// brand/icon colors
const ICON = {
  success: "#34D399", // green-400
  error:   "#F87171", // red-400
  info:    "#60A5FA", // blue-400
  warning: "#FBBF24", // amber-400
} as const;

type IconKey = keyof typeof ICON;

// base toast (no fixed border color here; we set it dynamically in didOpen)
const baseToast = MySwal.mixin({
  toast: true,
  position: "top-end",
  showConfirmButton: false,
  timer: 3000,
  timerProgressBar: true,
  background: DARK_BG,
  color: DARK_FG,
  customClass: {
    popup: "rounded-xl shadow-lg border", // keep a border, color set dynamically
    title: "text-gray-100",
    htmlContainer: "text-gray-300",
  },
});

// helper to fire a colored toast
function fireToast(type: IconKey, title: string, text?: string) {
  const color = ICON[type];
  return baseToast.fire({
    icon: type,
    iconColor: color,
    title,
    text,
    didOpen: (el) => {
      // border color to match icon
      (el as HTMLElement).style.border = `1.5px solid ${color}`;
      // optional subtle glow so it stands out on very dark bg
      (el as HTMLElement).style.boxShadow =
        `0 0 0 1px ${color} inset, 0 12px 28px -16px ${color}66`;

      // match progress bar to icon color
      const bar = el.querySelector(".swal2-timer-progress-bar") as HTMLElement | null;
      if (bar) bar.style.background = color;
    },
  });
}

export const notify = {
  success: (title: string, text?: string) => fireToast("success", title, text),
  error:   (title: string, text?: string) => fireToast("error", title, text),
  info:    (title: string, text?: string) => fireToast("info", title, text),
  warning: (title: string, text?: string) => fireToast("warning", title, text),
};


// optional: dark confirm modal with colored border based on icon
export async function confirm({
  title = "Are you sure?",
  text,
  confirmText = "Yes",
  cancelText = "Cancel",
  icon = "warning",
}: {
  title?: string;
  text?: string;
  confirmText?: string;
  cancelText?: string;
  icon?: IconKey;
}) {
  const color = ICON[icon];
  const res = await MySwal.fire({
    icon,
    title,
    text,
    background: DARK_BG,
    color: DARK_FG,
    showCancelButton: true,
    confirmButtonText: confirmText,
    cancelButtonText: cancelText,
    buttonsStyling: false,
    customClass: {
      popup: "rounded-2xl shadow-xl border",
      title: "text-gray-100",
      htmlContainer: "text-gray-300",
      confirmButton:
        "bg-red-600 hover:bg-red-700 text-white font-medium px-4 py-2 rounded-lg",
      cancelButton:
        "bg-gray-700 hover:bg-gray-600 text-gray-100 font-medium px-4 py-2 rounded-lg ml-2",
    },
    didOpen: (el) => {
      (el as HTMLElement).style.border = `1.5px solid ${color}`;
    },
  });
  return res.isConfirmed;
}
