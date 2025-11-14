import { motion } from 'framer-motion';

interface ChartData {
  label: string;
  value: number;
  color: string;
}

interface ProgressChartProps {
  data: ChartData[];
  maxValue?: number;
}

export const ProgressChart = ({ data, maxValue }: ProgressChartProps) => {
  const max = maxValue || Math.max(...data.map(d => d.value));

  return (
    <div className="flex items-end gap-3 h-48">
      {data.map((item, index) => (
        <div key={index} className="flex-1 flex flex-col items-center gap-2">
          <div className="w-full flex flex-col items-center justify-end h-40">
            <motion.div
              initial={{ height: 0 }}
              animate={{ height: `${(item.value / max) * 100}%` }}
              transition={{ delay: index * 0.1, duration: 0.6, ease: "easeOut" }}
              className={`w-full ${item.color} rounded-t-lg min-h-[8px] relative group hover:opacity-80 transition-opacity`}
            >
              <div className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="bg-gray-900 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
                  {item.value}
                </div>
              </div>
            </motion.div>
          </div>
          <span className="text-xs text-gray-600 font-medium">
            {item.label}
          </span>
        </div>
      ))}
    </div>
  );
};
