// src/pages/admin/AIManager.jsx
import React, { useEffect, useState } from "react";
import Sidebar from "../../components/admin/Sidebar";
import {
  runTextToSql,
  runTextToSqlWithGpt,
  getTextToSqlStats,
  getTextToSqlSuggest,
} from "../../services/text2sqlAPI";

function StatChip({ label, value }) {
  return (
    <div className="px-3 py-1 rounded-full bg-gray-100 text-xs flex items-center gap-1">
      <span className="text-gray-500">{label}:</span>
      <span className="font-semibold">{value}</span>
    </div>
  );
}

function StatusBadge({ ok }) {
  return (
    <span
      className={
        "inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold " +
        (ok
          ? "bg-green-100 text-green-700"
          : "bg-red-100 text-red-700")
      }
    >
      {ok ? "Success (ok: true)" : "Failed (ok: false)"}
    </span>
  );
}

export default function AIManager() {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [stats, setStats] = useState(null);
  const [suggestions, setSuggestions] = useState([]);
  const [originalSql, setOriginalSql] = useState(""); 

  const [error, setError] = useState("");
  const [showFullError, setShowFullError] = useState(false);

  // Toggle GPT Assist
  const [useGpt, setUseGpt] = useState(false);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const data = await getTextToSqlStats();
      setStats(data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSearch = async () => {
    if (!query.trim()) return;
    setLoading(true);
    setError("");
    setShowFullError(false);

    try {
      // OFF → /search, ON → /search_gpt
      const data = useGpt
        ? await runTextToSqlWithGpt(query)
        : await runTextToSql(query);

      setResult(data);
      setOriginalSql(data.original_sql || "");
    } catch (err) {
      console.error(err);
      setError("Không thể kết nối tới Text-to-SQL API.");
    } finally {
      setLoading(false);
    }
  };

  const handleChangeQuery = async (e) => {
    const value = e.target.value;
    setQuery(value);

    if (!value.trim()) {
      setSuggestions([]);
      return;
    }

    try {
      const data = await getTextToSqlSuggest(value);
      setSuggestions(data.suggestions || []);
    } catch (err) {
      console.error(err);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (!loading) handleSearch();
    }
  };

  const handlePickSuggestion = (s) => {
    setQuery(s);
    setSuggestions([]);
  };

  // Export CSV cho kết quả hiện tại
  const handleExportCsv = () => {
    if (
      !result ||
      !result.ok ||
      !Array.isArray(result.rows) ||
      result.rows.length === 0
    )
      return;

    const cols =
      (Array.isArray(result.columns) && result.columns.length > 0)
        ? result.columns
        : Object.keys(result.rows[0] || {});

    const header = cols.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(",");

    const lines = result.rows.map((row) =>
      cols
        .map((col) => {
          const val = row[col] ?? "";
          const s = String(val).replace(/"/g, '""');
          return `"${s}"`;
        })
        .join(",")
    );

    const csv = [header, ...lines].join("\r\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "text2sql_result.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex min-h-screen bg-gray-50 overflow-hidden">
      {/* Sidebar */}
      <Sidebar />

      {/* Main content */}
      <main className="flex-1 w-full ml-16 lg:ml-64 px-2 sm:px-4 lg:px-6 py-6 space-y-6 overflow-x-hidden">
        {/* Header + stats */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h1 className="text-2xl font-semibold">AI Text-to-SQL Monitor</h1>
          {stats && (
            <div className="flex flex-wrap gap-2 text-sm">
              <StatChip label="Total" value={stats.total} />
              <StatChip label="Success" value={stats.success} />
              <StatChip label="Failed" value={stats.failed} />
              <StatChip
                label="Success rate"
                value={`${(stats.success_rate * 100).toFixed(1)}%`}
              />
            </div>
          )}
        </div>

        {/* Input + Suggest + GPT toggle */}
        <div className="relative">
          <label className="block text-sm font-medium mb-1">
            Natural language query (English)
          </label>
          <textarea
            className="w-full border rounded-xl p-3 text-sm focus:outline-none focus:ring focus:ring-primary/40 bg-white"
            rows={3}
            value={query}
            onChange={handleChangeQuery}
            onKeyDown={handleKeyDown}
            placeholder={`Ví dụ: Show 5 courses where title like '%N%'`}
          />
          <div className="mt-2 flex flex-wrap items-center gap-4">
            <button
              onClick={handleSearch}
              disabled={loading}
              className="px-4 py-2 rounded-lg bg-primary text-white text-sm font-medium disabled:opacity-60"
            >
              {loading ? "Running..." : "Run Text-to-SQL (Enter)"}
            </button>

            <span className="text-xs text-gray-500">
              Nhấn <b>Enter</b> để gửi • <b>Shift+Enter</b> để xuống dòng
            </span>

            {/* 🔀 Toggle GPT Assist */}
            <label className="flex items-center gap-2 text-xs cursor-pointer">
              <span className="font-medium">GPT Assist</span>
              <div
                onClick={() => setUseGpt((v) => !v)}
                className={
                  "w-10 h-5 rounded-full flex items-center px-1 transition " +
                  (useGpt ? "bg-green-500" : "bg-gray-400")
                }
              >
                <div
                  className={
                    "w-4 h-4 rounded-full bg-white shadow transform transition " +
                    (useGpt ? "translate-x-4" : "translate-x-0")
                  }
                />
              </div>
            </label>
          </div>

          {/* Suggest dropdown */}
          {suggestions.length > 0 && (
            <div className="absolute z-20 mt-1 w-full max-h-48 overflow-y-auto bg-white border rounded-xl shadow text-sm">
              {suggestions.map((s, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handlePickSuggestion(s)}
                  className="w-full text-left px-3 py-2 hover:bg-gray-100"
                >
                  {s}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Lỗi kết nối API */}
        {error && (
          <div className="rounded-xl border border-red-400 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {/* Kết quả từ API */}
        {result && (
          <div className="space-y-4">
            {/* Trên: status + chips + GPT meta + SQL + error */}
            <div className="space-y-3">
              <div className="flex flex-wrap items-center gap-3 text-sm">
                <StatusBadge ok={result.ok} />
                {typeof result.rows_count === "number" && (
                  <StatChip label="Rows" value={result.rows_count} />
                )}
                {typeof result.duration_ms === "number" && (
                  <StatChip
                    label="Time"
                    value={`${result.duration_ms.toFixed(1)} ms`}
                  />
                )}

                {result.reviewed_by_gpt && (
                  <>
                    <StatChip label="Reviewed" value="GPT" />
                    <StatChip
                      label="SQL source"
                      value={result.sql_source || "unknown"}
                    />
                  </>
                )}
              </div>

              {/* SQL */}
              <div>
                <div className="text-xs text-gray-500 mb-1">
                  Generated SQL
                </div>
                <pre className="bg-gray-900 text-green-200 text-xs rounded-xl p-3 overflow-auto max-h-72">
{result.sql}
                </pre>
              </div>

              {/* ORIGINAL SQL FROM T5 */}
              {originalSql && originalSql.trim() !== "" && originalSql !== result.sql && (
                <div className="mt-3">
                  <div className="text-xs text-gray-500 mb-1">Original SQL (T5)</div>
                  <pre className="bg-gray-800 text-yellow-200 text-xs rounded-xl p-3 overflow-auto max-h-72">
                    {originalSql}
                  </pre>
                </div>
              )}

              {/* Error (nếu có) */}
              {!result.ok && result.error && (
                <div>
                  <div className="text-xs text-gray-500 mb-1">Error</div>
                  <div className="bg-red-900 text-red-50 text-xs rounded-xl p-3">
                    <div
                      className={
                        showFullError
                          ? "max-h-64 overflow-auto"
                          : "max-h-10 overflow-hidden"
                      }
                    >
                      <pre className="whitespace-pre-wrap">
{result.error}
                      </pre>
                    </div>

                    <button
                      type="button"
                      onClick={() => setShowFullError((v) => !v)}
                      className="mt-2 inline-flex items-center px-3 py-1 rounded-full bg-red-700/80 hover:bg-red-600 text-[11px] font-medium"
                    >
                      {showFullError ? "Thu gọn" : "Xem thêm"}
                    </button>
                  </div>
                </div>
              )}

              {/* Nếu có gpt_message thì show thêm */}
              {result.gpt_message && (
                <div className="text-xs text-gray-600 bg-yellow-50 border border-yellow-200 rounded-xl px-3 py-2">
                  <span className="font-semibold mr-1">GPT note:</span>
                  {result.gpt_message}
                </div>
              )}
            </div>

            {/* Bảng dữ liệu + Export CSV */}
            {result.ok &&
            Array.isArray(result.rows) &&
            result.rows.length > 0 ? (
              <div className="border rounded-xl bg-white">
                <div className="flex items-center justify-between bg-gray-50 px-3 py-2 text-sm font-medium">
                  <span>Query result</span>
                  <button
                    type="button"
                    onClick={handleExportCsv}
                    className="px-3 py-1 rounded-lg border border-primary text-primary text-xs hover:bg-primary hover:text-white transition"
                  >
                    Export CSV
                  </button>
                </div>
                <div className="overflow-x-auto overflow-y-auto max-h-80">
                  <table className="min-w-full text-xs">
                    <thead className="bg-gray-100">
                      <tr>
                        {result.columns?.map((col) => (
                          <th
                            key={col}
                            className="px-3 py-2 font-semibold text-left"
                          >
                            {col}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {result.rows.map((row, idx) => (
                        <tr
                          key={idx}
                          className={
                            idx % 2 === 0 ? "bg-white" : "bg-gray-50"
                          }
                        >
                          {result.columns.map((col) => (
                            <td key={col} className="px-3 py-2">
                              {String(row[col] ?? "")}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              <div className="text-sm text-gray-500">
                {result.ok
                  ? "Không có dòng dữ liệu nào trả về."
                  : "Không có dữ liệu để hiển thị."}
              </div>
            )}

            {/* Raw JSON để chắc chắn không mất field nào */}
            <details className="text-xs text-gray-500">
              <summary className="cursor-pointer select-none">
                Raw API response (debug)
              </summary>
              <pre className="mt-2 bg-gray-900 text-gray-100 rounded-lg p-3 overflow-auto max-h-72">
{JSON.stringify(result, null, 2)}
              </pre>
            </details>
          </div>
        )}

        {/* Lịch sử query */}
        {stats && stats.last_queries && stats.last_queries.length > 0 && (
          <div className="mt-4">
            <div className="text-sm font-medium mb-2">
              Lịch sử truy vấn gần đây
            </div>
            <div className="border rounded-xl overflow-hidden bg-white max-h-72 overflow-y-auto text-xs">
              <div className="w-full overflow-x-auto">
                <table className="min-w-full text-xs">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="px-3 py-2 text-left">NL query</th>
                      <th className="px-3 py-2 text-left">OK</th>
                      <th className="px-3 py-2 text-left">Rows</th>
                      <th className="px-3 py-2 text-left">Time (ms)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stats.last_queries.map((q, idx) => (
                      <tr
                        key={idx}
                        className={idx % 2 === 0 ? "bg-white" : "bg-gray-50"}
                      >
                        <td
                          className="px-3 py-2 max-w-xs truncate"
                          title={q.nl_query || ""}
                        >
                          {q.nl_query || "-"}
                        </td>
                        <td className="px-3 py-2">
                          <span
                            className={
                              q.ok ? "text-green-600" : "text-red-600"
                            }
                          >
                            {q.ok ? "OK" : "Fail"}
                          </span>
                        </td>
                        <td className="px-3 py-2">{q.rows_count ?? 0}</td>
                        <td className="px-3 py-2">
                          {q.duration_ms != null
                            ? q.duration_ms.toFixed(1)
                            : "-"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
