import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search, Car, Zap, Droplet, User, Calendar, ShieldCheck,
  Activity, MapPin, Hash, CircleDashed, AlertTriangle,
  Cpu, FileText, Building2, BadgeCheck
} from "lucide-react";
import { useVehicleSearch, VehicleData } from "@/hooks/use-vehicle-search";

export default function Home() {
  const { search, loading, error, data, history } = useVehicleSearch();
  const [query, setQuery] = useState("");
  const resultsRef = useRef<HTMLDivElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) search(query);
  };

  useEffect(() => {
    if (data && resultsRef.current) {
      setTimeout(() => {
        resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 150);
    }
  }, [data]);

  const d = data as VehicleData | null;

  /* ── Typed field helpers ── */
  const str = (key: string): string | null => {
    if (!d) return null;
    const v = d[key];
    return typeof v === "string" && v.trim() ? v.trim() : null;
  };
  const bool = (key: string): boolean | null => {
    if (!d || !(key in d)) return null;
    return Boolean(d[key]);
  };

  /* ── Extracted values ── */
  const regNo        = str("asset_number");
  const owner        = str("owner_name");
  const makeModel    = str("make_model");
  const makeName     = str("make_name");
  const modelFull    = str("model_name2") ?? str("model_name");
  const fuelType     = str("fuel_type");
  const color        = str("vehicle_color");
  const regDate      = str("registration_date");
  const regAddress   = str("registration_address");
  const permAddr     = str("permanent_address");
  const presAddr     = str("present_address");
  const chassis      = str("chassis_number");
  const engine       = str("engine_number");
  const insurer      = str("previous_insurer");
  const policyExpiry = str("previous_policy_expiry_date");
  const vType        = str("vehicle_type") ?? str("vehicle_type_v2");
  const vTypeProc    = str("vehicle_type_processed");
  const isCommercial = bool("is_commercial");
  const policyExpired = bool("previous_policy_expired");

  /* ── Badge colours ── */
  const getFuelColor = (f: string) => {
    const fl = f.toLowerCase();
    if (fl.includes("electric") || fl.includes("cng") || fl.includes("lpg"))
      return "bg-green-500/15 text-green-400 border-green-500/40";
    if (fl.includes("petrol"))
      return "bg-blue-500/15 text-blue-400 border-blue-500/40";
    if (fl.includes("diesel"))
      return "bg-orange-500/15 text-orange-400 border-orange-500/40";
    return "bg-slate-500/15 text-slate-400 border-slate-500/40";
  };

  const getExpiryColor = (dateStr: string | null, isExpired: boolean | null) => {
    if (isExpired === true) return "text-red-400";
    if (isExpired === false) return "text-green-400";
    if (!dateStr) return "text-white";
    const ms = Date.parse(dateStr);
    if (isNaN(ms)) return "text-white";
    const diff = (new Date(ms).getTime() - Date.now()) / 86400000;
    if (diff < 0) return "text-red-400";
    if (diff < 30) return "text-yellow-400";
    return "text-green-400";
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans overflow-x-hidden relative dark">

      {/* ── Ambient background ── */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80vw] h-[50vh] bg-primary/5 blur-[140px] rounded-full -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-[50vw] h-[50vh] bg-blue-700/5 blur-[100px] rounded-full translate-x-1/4 translate-y-1/4" />
        <div className="absolute inset-0 cyber-grid opacity-[0.12]" />
      </div>

      {/* ── Hero ── */}
      <main className="flex-grow flex flex-col items-center pt-24 px-4 sm:px-6 lg:px-8 relative z-10 w-full max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center w-full max-w-2xl"
        >
          <div className="inline-flex items-center justify-center gap-2 mb-6 px-4 py-1.5 rounded-full bg-secondary/50 border border-border backdrop-blur-sm">
            <Zap className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium tracking-wide text-primary">Vehicle Intelligence Portal</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 glow-text text-white">
            Identify Any Vehicle
          </h1>
          <p className="text-muted-foreground text-lg md:text-xl mb-10 max-w-xl mx-auto">
            Enter a registration number to instantly decode vehicle specifications, ownership details, and validity metrics.
          </p>

          {/* ── Search bar ── */}
          <form onSubmit={handleSubmit} className="relative group" data-testid="form-search">
            <div className="absolute -inset-1 bg-gradient-to-r from-primary/30 to-blue-600/30 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-500" />
            <div className="relative flex items-center bg-card border-2 border-border rounded-xl input-glow overflow-hidden transition-all">
              <div className="pl-6 text-muted-foreground">
                <Hash className="w-6 h-6" />
              </div>
              <input
                data-testid="input-vehicle-number"
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value.toUpperCase())}
                placeholder="RJ14TD6311"
                className="w-full bg-transparent border-none text-white text-2xl font-bold px-4 py-6 outline-none placeholder:text-muted-foreground/30 uppercase tracking-wider"
              />
              <button
                data-testid="button-search"
                type="submit"
                disabled={loading}
                className="mx-2 bg-primary text-primary-foreground p-4 rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 flex items-center justify-center"
              >
                {loading
                  ? <CircleDashed className="w-6 h-6 animate-spin" />
                  : <Search className="w-6 h-6" />}
              </button>
            </div>
          </form>

          {/* ── Recent searches ── */}
          {history.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="mt-8 flex flex-wrap items-center justify-center gap-2"
            >
              <span className="text-xs text-muted-foreground uppercase tracking-widest mr-2">Recent:</span>
              {history.map((h, i) => (
                <button
                  key={i}
                  data-testid={`chip-history-${i}`}
                  onClick={() => { setQuery(h); search(h); }}
                  className="px-3 py-1.5 text-sm font-mono bg-secondary/40 hover:bg-secondary border border-border rounded-md text-white transition-colors"
                >
                  {h}
                </button>
              ))}
            </motion.div>
          )}
        </motion.div>

        {/* ── Results ── */}
        <div ref={resultsRef} className="w-full mt-20 pb-24">
          <AnimatePresence mode="wait">

            {/* Error */}
            {error && !loading && (
              <motion.div
                key="error"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="bg-destructive/10 border border-destructive/30 p-6 rounded-xl text-center max-w-lg mx-auto backdrop-blur-sm"
                data-testid="status-error"
              >
                <AlertTriangle className="w-8 h-8 text-red-400 mx-auto mb-2" />
                <h3 className="font-semibold text-lg text-white mb-1">Search Failed</h3>
                <p className="text-red-300/80">{error}</p>
              </motion.div>
            )}

            {/* Loading skeletons */}
            {loading && (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="grid grid-cols-1 md:grid-cols-2 gap-6"
              >
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="bg-card/50 border border-border p-6 rounded-xl animate-pulse">
                    <div className="h-5 w-1/3 bg-muted rounded mb-6" />
                    <div className="space-y-4">
                      <div className="h-4 w-full bg-muted/50 rounded" />
                      <div className="h-4 w-5/6 bg-muted/50 rounded" />
                      <div className="h-4 w-4/6 bg-muted/50 rounded" />
                    </div>
                  </div>
                ))}
              </motion.div>
            )}

            {/* Results */}
            {d && !loading && (
              <motion.div
                key="results"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-6"
              >
                {/* ── Hero banner ── */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-gradient-to-br from-card to-card/50 border border-border p-8 rounded-2xl relative overflow-hidden"
                  data-testid="card-vehicle-header"
                >
                  <div className="absolute top-0 right-0 w-72 h-72 bg-primary/5 blur-[80px] rounded-full translate-x-1/2 -translate-y-1/2 pointer-events-none" />

                  <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 relative z-10">
                    <div>
                      {/* Badges row */}
                      <div className="flex flex-wrap items-center gap-2 mb-3">
                        {vType && (
                          <span className="px-3 py-1 bg-primary/10 text-primary border border-primary/20 rounded-full text-xs font-semibold uppercase tracking-wider">
                            {vType}
                          </span>
                        )}
                        {vTypeProc && vTypeProc !== vType && (
                          <span className="px-3 py-1 bg-secondary/60 text-muted-foreground border border-border rounded-full text-xs font-semibold uppercase tracking-wider">
                            {vTypeProc}
                          </span>
                        )}
                        {fuelType && (
                          <span className={`px-3 py-1 border rounded-full text-xs font-semibold uppercase tracking-wider ${getFuelColor(fuelType)}`}>
                            <span className="flex items-center gap-1"><Droplet className="w-3 h-3" />{fuelType}</span>
                          </span>
                        )}
                        {isCommercial !== null && (
                          <span className={`px-3 py-1 border rounded-full text-xs font-semibold uppercase tracking-wider ${isCommercial ? "bg-yellow-500/15 text-yellow-400 border-yellow-500/40" : "bg-cyan-500/15 text-cyan-400 border-cyan-500/40"}`}>
                            {isCommercial ? "Commercial" : "Private"}
                          </span>
                        )}
                      </div>

                      {/* Plate number */}
                      <h2
                        className="text-4xl md:text-5xl font-black font-mono tracking-tight text-white mb-2"
                        data-testid="text-reg-number"
                      >
                        {regNo ?? query}
                      </h2>

                      {/* Make / Model */}
                      <p className="text-xl text-muted-foreground flex items-center gap-2 mb-1">
                        <Car className="w-5 h-5 shrink-0" />
                        <span className="text-white font-semibold">{makeModel ?? `${makeName ?? ""}`}</span>
                      </p>
                      {modelFull && (
                        <p className="text-sm text-muted-foreground pl-7">{modelFull}</p>
                      )}
                    </div>

                    {regAddress && (
                      <div className="flex items-start gap-2 text-muted-foreground max-w-xs text-right md:text-right">
                        <MapPin className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                        <span className="font-medium text-white text-sm leading-snug" data-testid="text-rto">{regAddress}</span>
                      </div>
                    )}
                  </div>
                </motion.div>

                {/* ── Detail grid ── */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

                  {/* Ownership */}
                  <DataCard title="Ownership" icon={<User className="w-5 h-5 text-cyan-400" />} delay={0.1}>
                    <DataRow label="Owner Name" value={owner} data-testid="text-owner" />
                    <DataRow label="Registration Date" value={regDate} icon={<Calendar className="w-3.5 h-3.5 opacity-60" />} />
                    <DataRow label="Color" value={color} icon={<Activity className="w-3.5 h-3.5 opacity-60" />} />
                  </DataCard>

                  {/* Insurance */}
                  <DataCard title="Insurance" icon={<ShieldCheck className="w-5 h-5 text-emerald-400" />} delay={0.2}>
                    {insurer && (
                      <DataRow
                        label="Previous Insurer"
                        value={insurer.charAt(0).toUpperCase() + insurer.slice(1)}
                        icon={<Building2 className="w-3.5 h-3.5 opacity-60" />}
                      />
                    )}
                    <DataRow
                      label="Policy Expiry"
                      value={policyExpiry}
                      valueClassName={getExpiryColor(policyExpiry, policyExpired)}
                      icon={<Calendar className="w-3.5 h-3.5 opacity-60" />}
                    />
                    {policyExpired !== null && (
                      <div className="flex flex-col mt-1">
                        <span className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Status</span>
                        <span className={`flex items-center gap-1.5 text-sm font-semibold ${policyExpired ? "text-red-400" : "text-green-400"}`}>
                          {policyExpired
                            ? <><AlertTriangle className="w-4 h-4" /> Policy Expired</>
                            : <><BadgeCheck className="w-4 h-4" /> Policy Active</>
                          }
                        </span>
                      </div>
                    )}
                  </DataCard>

                  {/* Vehicle specs */}
                  <DataCard title="Vehicle Details" icon={<Activity className="w-5 h-5 text-purple-400" />} delay={0.3}>
                    <DataRow label="Type" value={vType} />
                    <DataRow label="Fuel" value={fuelType} />
                    <DataRow label="Color" value={color} />
                    {isCommercial !== null && (
                      <DataRow label="Usage" value={isCommercial ? "Commercial" : "Personal / Private"} />
                    )}
                  </DataCard>

                  {/* Chassis & Engine */}
                  {(chassis || engine) && (
                    <DataCard title="Identifiers" icon={<Cpu className="w-5 h-5 text-rose-400" />} delay={0.4}>
                      <DataRow label="Chassis Number" value={chassis} mono />
                      <DataRow label="Engine Number" value={engine} mono />
                    </DataCard>
                  )}

                  {/* Address */}
                  {(permAddr || presAddr) && (
                    <DataCard
                      title="Address"
                      icon={<MapPin className="w-5 h-5 text-amber-400" />}
                      delay={0.5}
                      wide
                    >
                      {permAddr && (
                        <div className="flex flex-col">
                          <span className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Permanent Address</span>
                          <span className="font-medium text-white leading-snug" data-testid="text-address">{permAddr}</span>
                        </div>
                      )}
                      {presAddr && presAddr !== permAddr && (
                        <div className="flex flex-col mt-3">
                          <span className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Present Address</span>
                          <span className="font-medium text-white leading-snug">{presAddr}</span>
                        </div>
                      )}
                    </DataCard>
                  )}

                  {/* Registration info */}
                  <DataCard title="Registration" icon={<FileText className="w-5 h-5 text-sky-400" />} delay={0.6}>
                    <DataRow label="Registration Date" value={regDate} />
                    <DataRow label="RTO Office" value={regAddress} />
                    <DataRow label="Asset Type" value={str("asset_type")} />
                  </DataCard>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}

/* ── Sub-components ── */

interface DataCardProps {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  delay: number;
  wide?: boolean;
}

function DataCard({ title, icon, children, delay, wide }: DataCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className={`bg-card border border-border p-6 rounded-xl flex flex-col backdrop-blur-sm ${wide ? "md:col-span-2" : ""}`}
    >
      <div className="flex items-center gap-3 mb-5 pb-4 border-b border-border/50">
        <div className="p-2 bg-secondary rounded-lg">{icon}</div>
        <h3 className="font-semibold text-white tracking-wide">{title}</h3>
      </div>
      <div className="space-y-4 flex-grow">{children}</div>
    </motion.div>
  );
}

interface DataRowProps {
  label: string;
  value: string | null | undefined;
  valueClassName?: string;
  icon?: React.ReactNode;
  mono?: boolean;
  "data-testid"?: string;
}

function DataRow({ label, value, valueClassName = "text-white", icon, mono, ...rest }: DataRowProps) {
  if (!value) return null;
  return (
    <div className="flex flex-col" {...rest}>
      <span className="text-xs text-muted-foreground uppercase tracking-wider mb-1 flex items-center gap-1">
        {icon}{label}
      </span>
      <span className={`font-medium ${mono ? "font-mono text-sm" : ""} ${valueClassName} break-all`}>
        {value}
      </span>
    </div>
  );
}
