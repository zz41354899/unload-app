
import React from 'react';
import { useAppStore } from '../store';
import { Task, ResponsibilityOwner } from '../types';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Smile, MessageSquare, Book, TrendingUp, AlertCircle } from 'lucide-react';

interface DashboardProps {
  navigate: (page: string) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ navigate }) => {
  const { tasks, user } = useAppStore();
  
  // Date Helper
  const today = new Date();
  const currentYear = today.getFullYear();
  const currentMonth = today.getMonth() + 1;

  // Stats Calculation
  const totalTasks = tasks.length;
  const myTasks = tasks.filter(t => t.owner === ResponsibilityOwner.Mine).length;
  const theirTasks = tasks.filter(t => t.owner === ResponsibilityOwner.Theirs).length;
  const sharedTasks = tasks.filter(t => t.owner === ResponsibilityOwner.Shared).length;

  // Chart Data - Task Ratio
  const pieData = [
    { name: '共同課題', value: sharedTasks, color: '#1ABC9C' }, 
    { name: '我的課題', value: myTasks, color: '#2C3E2C' },
    { name: '他的課題', value: theirTasks, color: '#E5E7EB' },
  ].filter(d => d.value > 0);

  // Trend Chart - Future 7 Days (Starting Today)
  const getTrendData = () => {
    const data = [];
    // Normalize "Today" to midnight for consistent comparison
    const todayNormal = new Date();
    todayNormal.setHours(0,0,0,0);

    // 0 to 6 represents Today + next 6 days
    for (let i = 0; i < 7; i++) {
      const d = new Date(todayNormal);
      d.setDate(todayNormal.getDate() + i); 
      
      const dateStr = d.toLocaleDateString('zh-TW', { month: '2-digit', day: '2-digit' }); // e.g. 11/20
      
      // Count tasks for this specific calendar day
      const count = tasks.filter(t => {
        const tDate = new Date(t.date);
        tDate.setHours(0,0,0,0);
        return tDate.getTime() === d.getTime();
      }).length;

      // Use 0 instead of null so the line chart is continuous even with empty days
      data.push({
        name: dateStr,
        val: count
      });
    }
    return data;
  };

  const trendData = getTrendData();

  // Source Logic - Get All Sources
  const getAllSources = () => {
    if (tasks.length === 0) return [];
    
    // Group by Worry to find counts
    const counts: Record<string, number> = {};
    tasks.forEach(t => {
      counts[t.worry] = (counts[t.worry] || 0) + 1;
    });
    
    const sortedWorries = Object.entries(counts).sort((a, b) => b[1] - a[1]);
    if (sortedWorries.length === 0) return [];

    const maxCount = sortedWorries[0][1];
    
    return sortedWorries.map(([worryName, count]) => {
        // Find dominant owner for this worry to color code it
        const worryTasks = tasks.filter(t => t.worry === worryName);
        const ownerCounts: Record<string, number> = {};
        worryTasks.forEach(t => {
            ownerCounts[t.owner] = (ownerCounts[t.owner] || 0) + 1;
        });
        const sortedOwners = Object.entries(ownerCounts).sort((a, b) => b[1] - a[1]);
        const dominantOwner = sortedOwners[0] ? sortedOwners[0][0] : ResponsibilityOwner.Shared;
        
        return { 
            name: worryName, 
            count, 
            dominantOwner,
            percent: (count / maxCount) * 100 
        };
    });
  };

  const sources = getAllSources();
  
  // Determine Bar Color based on dominant owner
  const getSourceColor = (owner: string) => {
      if (owner === ResponsibilityOwner.Mine) return '#2C3E2C';
      if (owner === ResponsibilityOwner.Shared) return '#1ABC9C';
      return '#9CA3AF'; // Gray for Theirs
  };

  // Today's Reflection Logic - Get All Today's Tasks
  const getTodayReflections = () => {
    const todayNormal = new Date();
    todayNormal.setHours(0,0,0,0);

    const todaysTasks = tasks.filter(t => {
      const d = new Date(t.date);
      d.setHours(0,0,0,0);
      return d.getTime() === todayNormal.getTime();
    });
    // Sort by newest first
    return todaysTasks.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  };

  const todayReflections = getTodayReflections();

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-12 animate-fade-in">
      
      {/* Header Section */}
      <div className="bg-white rounded-2xl p-8 md:p-12 shadow-sm border border-gray-100">
         <div className="flex justify-between items-start">
            <div>
                <h1 className="text-2xl font-bold mb-4">今天，先問問自己</h1>
                <p className="text-gray-600 mb-8">哪些是我能處理的？哪些不是我的責任？</p>
            </div>
            <div className="text-right hidden md:block">
                <div className="text-3xl font-bold text-primary/20">{currentYear}</div>
                <div className="text-xl font-medium text-primary/40">{currentMonth} 月</div>
            </div>
         </div>
         <button 
            onClick={() => navigate('new-task')}
            className="bg-primary text-white px-8 py-3 rounded-full hover:bg-[#1e2b1e] transition-all shadow-lg shadow-primary/20 hover:shadow-primary/40"
         >
            開始新的覺察
         </button>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
            { label: '總分離次數', value: totalTasks, icon: TrendingUp, delay: 0 },
            { label: '我的課題', value: myTasks, icon: Book, delay: 100 },
            { label: '他的課題', value: theirTasks, icon: MessageSquare, delay: 200 },
            { label: '共同的課題', value: sharedTasks, icon: Smile, delay: 300 },
        ].map((stat, idx) => (
            <div 
                key={stat.label} 
                className="bg-white p-6 rounded-2xl shadow-sm min-h-[160px] flex flex-col justify-between animate-slide-up"
                style={{ animationDelay: `${stat.delay}ms` }}
            >
                <stat.icon className="w-5 h-5 text-gray-400 mb-2" />
                <div>
                    <div className="text-4xl font-bold mb-1 text-text">{stat.value}</div>
                    <div className="text-sm text-gray-500 font-medium">{stat.label}</div>
                </div>
            </div>
        ))}
      </div>

      {/* Middle Row: Trend Chart & Pie Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
         
         {/* Trend Chart */}
         <div className="lg:col-span-2 bg-white p-8 rounded-2xl shadow-sm">
            <div className="flex justify-between items-center mb-8">
                <h3 className="text-lg font-bold">一週未來情緒趨勢</h3>
                <span className="text-sm text-gray-400">{currentYear}年{currentMonth}月</span>
            </div>
            <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={trendData}>
                        <CartesianGrid vertical={false} stroke="#f0f0f0" />
                        <XAxis 
                            dataKey="name" 
                            axisLine={false} 
                            tickLine={false} 
                            tick={{fontSize: 12, fill: '#666'}}
                            dy={10}
                        />
                        <YAxis 
                            axisLine={false} 
                            tickLine={false}
                            tick={{fontSize: 12, fill: '#666'}}
                            allowDecimals={false}
                            domain={[0, 'auto']} 
                        />
                        <Tooltip 
                            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                            cursor={{ stroke: '#1ABC9C', strokeWidth: 1, strokeDasharray: '4 4' }}
                        />
                        <Line 
                            type="linear" 
                            dataKey="val" 
                            stroke="#1ABC9C" 
                            strokeWidth={3} 
                            dot={{r: 5, fill: '#1ABC9C', strokeWidth: 2, stroke: '#fff'}} 
                            activeDot={{r: 7, strokeWidth: 0}}
                            animationDuration={1500}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>
         </div>

         {/* Ratio Pie Chart */}
         <div className="bg-white p-8 rounded-2xl shadow-sm flex flex-col">
            <h3 className="text-lg font-bold mb-4">課題比例</h3>
            {totalTasks > 0 ? (
                <>
                    <div className="flex-1 flex items-center justify-center relative">
                        <div className="w-[220px] h-[220px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={pieData}
                                        innerRadius={70}
                                        outerRadius={100}
                                        paddingAngle={2}
                                        dataKey="value"
                                        stroke="none"
                                        cornerRadius={4}
                                        animationDuration={1500}
                                    >
                                        {pieData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Pie>
                                </PieChart>
                            </ResponsiveContainer>
                            {/* Center Text - Shows Total Tasks */}
                            <div className="absolute inset-0 flex items-center justify-center pointer-events-none flex-col">
                                <span className="text-5xl font-bold text-text animate-scale-in">
                                {totalTasks}
                                </span>
                            </div>
                        </div>
                    </div>
                    <div className="mt-4 flex justify-center gap-4 text-sm flex-wrap">
                        {sharedTasks > 0 && (
                            <div className="flex items-center gap-2">
                                <span className="w-3 h-3 rounded-full bg-[#1ABC9C]"></span>
                                <span className="text-gray-600 font-medium">共同課題</span>
                            </div>
                        )}
                        {myTasks > 0 && (
                            <div className="flex items-center gap-2">
                                <span className="w-3 h-3 rounded-full bg-[#2C3E2C]"></span>
                                <span className="text-gray-600 font-medium">我的課題</span>
                            </div>
                        )}
                        {theirTasks > 0 && (
                            <div className="flex items-center gap-2">
                                <span className="w-3 h-3 rounded-full bg-[#E5E7EB]"></span>
                                <span className="text-gray-600 font-medium">他的課題</span>
                            </div>
                        )}
                    </div>
                </>
            ) : (
                <div className="flex-1 flex flex-col items-center justify-center text-gray-400 pb-4">
                   <div className="w-24 h-24 rounded-full border-8 border-gray-50 mb-4 box-border"></div>
                   <span className="text-sm">尚無資料</span>
                </div>
            )}
         </div>

      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Source Bar */}
          <div className="bg-white p-8 rounded-2xl shadow-sm min-h-[200px] flex flex-col">
              <h3 className="text-base font-medium mb-8">主要課題來源</h3>
              {sources.length > 0 ? (
                <div className="space-y-6 overflow-y-auto max-h-[300px] pr-2 scrollbar-hide">
                    {sources.map((source, index) => (
                        <div key={source.name} className="flex items-center gap-4 animate-slide-up" style={{ animationDelay: `${index * 50}ms` }}>
                            <span className="text-xs text-gray-500 w-16 text-right shrink-0">{source.name}</span>
                            <div className="flex-1 bg-gray-100 rounded-full h-4 overflow-hidden relative">
                                {/* Background grid lines simulation */}
                                <div className="absolute inset-0 grid grid-cols-4">
                                    <div className="border-r border-white"></div>
                                    <div className="border-r border-white"></div>
                                    <div className="border-r border-white"></div>
                                </div>
                                {/* Dynamic color based on the dominant owner of this worry source */}
                                <div 
                                    className="h-full rounded-full transition-all duration-1000 ease-out" 
                                    style={{
                                        width: `${source.percent}%`, 
                                        backgroundColor: getSourceColor(source.dominantOwner)
                                    }}
                                ></div>
                            </div>
                        </div>
                    ))}
                </div>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center text-gray-400 pb-8">
                   <div className="w-12 h-2 bg-gray-100 rounded-full mb-2"></div>
                   <span className="text-sm">尚無資料</span>
                </div>
              )}
          </div>

          {/* Today's Reflection */}
          <div className="bg-white p-8 rounded-2xl shadow-sm min-h-[200px] flex flex-col">
              <h3 className="text-base font-medium mb-6">今日反思</h3>
              {todayReflections.length > 0 ? (
                <div className="space-y-4 overflow-y-auto max-h-[300px] pr-2 scrollbar-hide">
                    {todayReflections.map((task, index) => (
                        <div 
                            key={task.id} 
                            className="flex items-start gap-3 group hover:bg-gray-50 p-2 rounded-lg transition-colors animate-slide-up"
                            style={{ animationDelay: `${index * 50}ms` }}
                        >
                            {/* Side bar color reflects owner */}
                            <div 
                                className="w-1 h-10 rounded-full mt-1 shrink-0"
                                style={{ backgroundColor: getSourceColor(task.owner) }}
                            ></div>
                            
                            <div className="flex-1 min-w-0">
                                <div className="font-bold text-text truncate">{task.category}</div>
                                <div className="text-xs text-gray-500 mb-1 truncate">{task.worry}</div>
                            </div>
                            
                            {/* Tag reflects owner */}
                            <span 
                                className="text-white text-xs px-3 py-1 rounded-full whitespace-nowrap shrink-0"
                                style={{ backgroundColor: getSourceColor(task.owner) }}
                            >
                                {task.owner === ResponsibilityOwner.Mine ? '我的' : 
                                 task.owner === ResponsibilityOwner.Shared ? '共同' : '他的'}
                            </span>
                        </div>
                    ))}
                </div>
              ) : (
                 <div className="flex-1 flex flex-col items-center justify-center text-gray-400 pb-8">
                    <AlertCircle className="w-8 h-8 mb-2 opacity-20" />
                    <span className="text-sm">今日尚未新增覺察</span>
                    <button onClick={() => navigate('new-task')} className="text-primary text-xs font-bold mt-2 hover:underline">
                        立即新增
                    </button>
                 </div>
              )}
          </div>
      </div>

    </div>
  );
};
