import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { format } from "date-fns";
import {
  X,
  Monitor,
  Smartphone,
  Tablet,
  Globe,
  Calendar,
} from "lucide-react";
import { authService } from "../../features/auth/services/authService";
import type { LoginActivity } from "../../features/auth/types/auth.types";

interface LoginActivityModalProps {
  open: boolean;
  onClose: () => void;
}

export default function LoginActivityModal({
  open,
  onClose,
}: LoginActivityModalProps) {
  const [activities, setActivities] = useState<LoginActivity[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchLoginActivity = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await authService.getLoginActivity();
      setActivities(data);
    } catch (error) {
      console.error("Failed to fetch login activity:", error);
      setError("Failed to load login activity. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (open) {
      fetchLoginActivity();
    }
  }, [open]);

  const getDeviceIcon = (device: string) => {
    const d = device.toLowerCase();

    if (d.includes("iphone") || d.includes("android") || d.includes("mobile")) {
      return <Smartphone className="w-4 h-4" />;
    }
    if (d.includes("ipad") || d.includes("tablet")) {
      return <Tablet className="w-4 h-4" />;
    }
    return <Monitor className="w-4 h-4" />;
  };

  const formatDeviceName = (device: string) => {
    const d = device.toLowerCase();
    let browser = "Unknown Browser";
    let os = "Unknown OS";

    if (d.includes("chrome")) browser = "Chrome";
    else if (d.includes("firefox")) browser = "Firefox";
    else if (d.includes("safari") && !d.includes("chrome")) browser = "Safari";
    else if (d.includes("edge")) browser = "Edge";

    if (d.includes("windows")) os = "Windows";
    else if (d.includes("mac")) os = "macOS";
    else if (d.includes("linux")) os = "Linux";
    else if (d.includes("iphone") || d.includes("ipad")) os = "iOS";
    else if (d.includes("android")) os = "Android";

    return `${browser} on ${os}`;
  };

  const formatIPAddress = (ip: string) => {
    if (ip.includes(".")) {
      const parts = ip.split(".");
      return `${parts[0]}.${parts[1]}.***.***`;
    }
    if (ip.includes(":")) return "IPv6 Address";
    return ip;
  };

  if (!open) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 bg-slate-950/95 backdrop-blur-md">
      <div className="absolute inset-0" onClick={onClose} />

      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="w-full max-w-2xl max-h-[90vh] bg-slate-950/95 border border-slate-800/70 rounded-3xl overflow-hidden flex flex-col shadow-2xl shadow-black/35">
          <div className="flex items-center justify-between p-6 border-b border-white/10 shrink-0 bg-slate-900/90">
            <h2 className="text-xl font-semibold text-white flex items-center gap-2">
              <Monitor className="w-5 h-5 text-green-400" />
              Login Activity
            </h2>
            <button
              onClick={onClose}
              className="inline-flex items-center justify-center rounded-full bg-white/5 p-2 text-slate-200 hover:bg-white/10 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-6 overflow-y-auto flex-1 bg-slate-950/90">
            {loading ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin h-8 w-8 border-b-2 border-green-400" />
              </div>
            ) : error ? (
              <div className="text-center text-red-400 py-8">
                <Monitor className="w-10 h-10 mx-auto mb-3 opacity-50" />
                {error}
              </div>
            ) : activities.length === 0 ? (
              <div className="text-center text-slate-100 py-8">
                <Monitor className="w-10 h-10 mx-auto mb-3 opacity-50" />
                No activity found
              </div>
            ) : (
              <div className="space-y-4">
                {activities.map((activity) => (
                  <div
                    key={activity.id}
                    className="flex justify-between p-4 bg-slate-900/80 rounded-xl border border-slate-700/60 hover:bg-slate-900/95 transition-colors"
                  >
                    <div className="flex gap-3 min-w-0 flex-1">
                      {getDeviceIcon(activity.device)}
                      <div className="min-w-0 flex-1">
                        <p className="text-white font-medium truncate">
                          {formatDeviceName(activity.device)}
                        </p>
                        <div className="flex flex-wrap gap-4 text-sm text-slate-300 mt-1">
                          <span className="flex items-center gap-1 shrink-0">
                            <Globe className="w-3 h-3" />
                            {formatIPAddress(activity.ip)}
                          </span>
                          <span className="flex items-center gap-1 shrink-0">
                            <Calendar className="w-3 h-3" />
                            {format(new Date(activity.lastUsed), "MMM dd, yyyy")}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="text-right text-xs text-slate-200 shrink-0 ml-4">
                      <p>Last active</p>
                      <p>{format(new Date(activity.lastUsed), "HH:mm")}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="p-4 border-t border-slate-800/70 text-xs text-slate-200 shrink-0 bg-slate-950/90">
            If you see unfamiliar activity, change your password immediately.
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}