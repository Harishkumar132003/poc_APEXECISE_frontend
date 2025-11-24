// AutoChart.jsx
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  Cell
} from "recharts";

export default function AutoChart({ data }) {
  if (!data) return null;

  const { chart_type, labels, values, datasets, colors, title } = data;

  // -----------------------------
  // Build data for Recharts
  // -----------------------------
  let chartData = [];

  if (datasets && datasets.length > 0) {
    // Multi-series
    chartData = labels.map((label, i) => {
      const row = { name: label };
      datasets.forEach((ds) => {
        row[ds.label] = ds.data[i];
      });
      return row;
    });
  } else {
    // Single-series
    chartData = labels.map((label, i) => ({
      name: label,
      value: values[i],
      color: colors?.[i] || "#8884d8"
    }));
  }

  // -----------------------------
  // Render Charts
  // -----------------------------

  return (
    <div style={{ width: "100%", marginTop: 10 }}>
      <h3 style={{ marginBottom: 10, textAlign: "center" }}>{title}</h3>

      {/* BAR CHART */}
      {chart_type === "bar" && (
        <BarChart width={500} height={300} data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis width={80}
  tickFormatter={(value) => Number(value).toLocaleString("en-IN")} />
          <Tooltip />
          <Legend />

          {datasets ? (
            // MULTI SERIES BAR
            datasets.map((ds, i) => (
              <Bar
                key={i}
                dataKey={ds.label}
                fill={ds.color || "#8884d8"}
              />
            ))
          ) : (
            // SINGLE SERIES BAR
            <Bar dataKey="value">
              {chartData.map((entry, index) => (
                <Cell
                  key={index}
                  fill={entry.color}
                />
              ))}
            </Bar>
          )}
        </BarChart>
      )}

      {/* LINE CHART */}
      {chart_type === "line" && (
        <LineChart width={500} height={300} data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          {datasets ? (
            datasets.map((ds, i) => (
              <Line
                key={i}
                dataKey={ds.label}
                stroke={ds.color || "#8884d8"}
                strokeWidth={2}
              />
            ))
          ) : (
            <Line dataKey="value" stroke="#8884d8" strokeWidth={2} />
          )}
        </LineChart>
      )}

      {/* PIE CHART */}
      {chart_type === "pie" && (
        <PieChart width={500} height={300}>
          <Pie
            data={chartData}
            dataKey="value"
            nameKey="name"
            outerRadius={120}
          >
            {chartData.map((entry, index) => (
              <Cell
                key={index}
                fill={colors?.[index] || "#8884d8"}
              />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      )}
    </div>
  );
}
