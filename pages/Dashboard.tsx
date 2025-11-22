
import React, { useState } from 'react';
import { useAppStore } from '../store';
import { Task, ResponsibilityOwner } from '../types';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar } from 'recharts';
import { Smile, MessageSquare, Book, TrendingUp, AlertCircle, ChevronDown, Zap, Target, Brain, ZoomIn, Users, Lightbulb, Waves, Sparkles } from 'lucide-react';
import { getDailyQuote } from '../lib/quotes';

interface DashboardProps {
  navigate: (page: string) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ navigate }) => {
  const { tasks, user } = useAppStore();
  const [trendMode, setTrendMode] = useState<'future' | 'past'>('future');
  
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

  // Trend Chart - Support both Future 7 Days and Past 7 Days
  const getTrendData = () => {
    const data = [];
    // Normalize "Today" to midnight for consistent comparison
    const todayNormal = new Date();
    todayNormal.setHours(0,0,0,0);

    if (trendMode === 'future') {
      // Future: Today + next 6 days
      for (let i = 0; i < 7; i++) {
        const d = new Date(todayNormal);
        d.setDate(todayNormal.getDate() + i); 
        
        const dateStr = d.toLocaleDateString('zh-TW', { month: '2-digit', day: '2-digit' });
        
        const count = tasks.filter(t => {
          const tDate = new Date(t.date);
          tDate.setHours(0,0,0,0);
          return tDate.getTime() === d.getTime();
        }).length;

        data.push({
          name: dateStr,
          val: count
        });
      }
    } else {
      // Past: Last 6 days + Today
      for (let i = 6; i >= 0; i--) {
        const d = new Date(todayNormal);
        d.setDate(todayNormal.getDate() - i); 
        
        const dateStr = d.toLocaleDateString('zh-TW', { month: '2-digit', day: '2-digit' });
        
        const count = tasks.filter(t => {
          const tDate = new Date(t.date);
          tDate.setHours(0,0,0,0);
          return tDate.getTime() === d.getTime();
        }).length;

        data.push({
          name: dateStr,
          val: count
        });
      }
    }
    return data;
  };

  const trendData = getTrendData();

  // Source Logic - Get All Sources
  const getAllSources = () => {
    if (tasks.length === 0) return [];
    
    // Group by Worry to find counts (handle both single and multiple worries)
    const counts: Record<string, number> = {};
    tasks.forEach(t => {
      const worries = Array.isArray(t.worry) ? t.worry : [t.worry];
      worries.forEach(worry => {
        counts[worry] = (counts[worry] || 0) + 1;
      });
    });
    
    const sortedWorries = Object.entries(counts).sort((a, b) => b[1] - a[1]);
    if (sortedWorries.length === 0) return [];

    const maxCount = sortedWorries[0][1];
    
    return sortedWorries.map(([worryName, count]) => {
        // Find dominant owner for this worry to color code it
        const worryTasks = tasks.filter(t => {
          const worries = Array.isArray(t.worry) ? t.worry : [t.worry];
          return worries.includes(worryName);
        });
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
    <div className="max-w-6xl mx-auto space-y-8 pb-12">
      
      {/* Header Section */}
      <div className="bg-white rounded-2xl p-8 md:p-12 shadow-sm border border-gray-100">
         <div className="flex justify-between items-start">
            <div>
                <h1 className="text-2xl font-bold mb-4">今天，先照顧好自己的選擇</h1>
                <p className="text-gray-600 mb-8">外在的標準裡，哪些是真正屬於你的？</p>
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
            開始釐清脈絡
         </button>
      </div>

      {/* Daily Quote */}
      <div className="bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10 rounded-2xl p-8 border border-primary/20 shadow-sm">
        <div className="flex items-start gap-4">
          <Sparkles className="w-6 h-6 text-primary shrink-0 mt-1" />
          <div className="flex-1">
            <p className="text-sm text-primary/60 font-medium mb-2">今日語錄</p>
            <p className="text-lg leading-relaxed text-text font-medium">
              "{getDailyQuote()}"
            </p>
          </div>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
            { label: '釐清次數', value: totalTasks, icon: TrendingUp, delay: 0 },
            { label: '我能掌控的部分', value: myTasks, icon: Book, delay: 100 },
            { label: '不在我範圍內的部分', value: theirTasks, icon: MessageSquare, delay: 200 },
            { label: '共同的影響部分', value: sharedTasks, icon: Smile, delay: 300 },
        ].map((stat, idx) => (
            <div 
                key={stat.label} 
                className="bg-white p-6 rounded-2xl shadow-sm min-h-[160px] flex flex-col justify-between"
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
         <div className="lg:col-span-2 bg-white p-6 md:p-8 rounded-2xl shadow-sm">
            <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 md:gap-3 mb-6 md:mb-8">
                <h3 className="text-base md:text-lg font-bold">
                  {trendMode === 'future' ? '一週內的狀態變化' : '一週內的狀態變化'}
                </h3>
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <select 
                      value={trendMode}
                      onChange={(e) => setTrendMode(e.target.value as 'future' | 'past')}
                      className="appearance-none bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 pr-8 text-xs md:text-sm font-medium text-gray-700 cursor-pointer hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-primary/20"
                    >
                      <option value="future">未來7天</option>
                      <option value="past">過去7天</option>
                    </select>
                    <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                  </div>
                  <span className="text-xs md:text-sm text-gray-400 whitespace-nowrap">{currentYear}年{currentMonth}月</span>
                </div>
            </div>
            <ResponsiveContainer width="100%" height={350}>
                    <LineChart data={trendData} margin={{ top: 10, right: 20, left: 0, bottom: 20 }}>
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
                            width={30}
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

         {/* Ratio Pie Chart */}
         <div className="bg-white p-8 rounded-2xl shadow-sm flex flex-col min-h-[500px]">
            <h3 className="text-lg font-bold mb-4">外在因素分布</h3>
            {totalTasks > 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center">
                    <div className="flex items-center justify-center relative" style={{ width: '220px', height: '220px' }}>
                        <ResponsiveContainer width={220} height={220}>
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
                                <span className="text-5xl font-bold text-text">
                                {totalTasks}
                                </span>
                        </div>
                    </div>
                    <div className="mt-4 flex justify-center gap-4 text-sm flex-wrap">
                        {sharedTasks > 0 && (
                            <div className="flex items-center gap-2">
                                <span className="w-3 h-3 rounded-full bg-[#1ABC9C]"></span>
                                <span className="text-gray-600 font-medium">共同的影響部分</span>
                            </div>
                        )}
                        {myTasks > 0 && (
                            <div className="flex items-center gap-2">
                                <span className="w-3 h-3 rounded-full bg-[#2C3E2C]"></span>
                                <span className="text-gray-600 font-medium">我能掌控的部分</span>
                            </div>
                        )}
                        {theirTasks > 0 && (
                            <div className="flex items-center gap-2">
                                <span className="w-3 h-3 rounded-full bg-[#E5E7EB]"></span>
                                <span className="text-gray-600 font-medium">不在我範圍內的部分</span>
                            </div>
                        )}
                    </div>
                </div>
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
              <h3 className="text-base font-medium mb-8">困擾最大的原因</h3>
              {sources.length > 0 ? (
                <div className="space-y-6 overflow-y-auto max-h-[300px] pr-2 scrollbar-hide">
                    {sources.map((source, index) => (
                        <div key={source.name} className="flex items-center gap-4">
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
              <h3 className="text-base font-medium mb-6">自我檢視</h3>
              {todayReflections.length > 0 ? (
                <div className="space-y-4 overflow-y-auto max-h-[300px] pr-2 scrollbar-hide">
                    {todayReflections.map((task, index) => (
                        <div 
                            key={task.id} 
                            className="flex items-start gap-3 group hover:bg-gray-50 p-2 rounded-lg transition-colors"
                        >
                            {/* Side bar color reflects owner */}
                            <div 
                                className="w-1 h-10 rounded-full mt-1 shrink-0"
                                style={{ backgroundColor: getSourceColor(task.owner) }}
                            ></div>
                            
                            <div className="flex-1 min-w-0">
                                <div className="font-bold text-text truncate">
                                  {Array.isArray(task.category) ? task.category.join(', ') : task.category}
                                </div>
                                <div className="text-xs text-gray-500 mb-1 truncate">
                                  {Array.isArray(task.worry) ? task.worry.join(', ') : task.worry}
                                </div>
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
                    <span className="text-sm">今天還沒有新增檢視</span>
                    <button onClick={() => navigate('new-task')} className="text-primary text-xs font-bold mt-2 hover:underline">
                        立即開始
                    </button>
                 </div>
              )}
          </div>
      </div>

      {/* Simplified Insights Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Quick Stats */}
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
          <div className="flex items-center gap-2 mb-6">
            <Zap className="w-5 h-5 text-primary" />
            <h3 className="font-bold text-lg">掌控力概況</h3>
          </div>
          
          {tasks.length > 0 ? (
            <div className="space-y-4">
              {(() => {
                const avgControl = Math.round(tasks.reduce((sum, t) => sum + t.controlLevel, 0) / tasks.length);
                
                return (
                  <>
                    <div className="bg-gradient-to-br from-primary/10 to-accent/10 rounded-lg p-6 border border-primary/20">
                      <div className="text-sm text-gray-600 mb-2">平均掌控力</div>
                      <div className="text-4xl font-bold text-primary mb-2">{avgControl}%</div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-primary h-2 rounded-full transition-all duration-500" 
                          style={{ width: `${avgControl}%` }}
                        ></div>
                      </div>
                    </div>
                    
                    <p className="text-sm text-gray-600 leading-relaxed">
                      {avgControl >= 70 
                        ? '你傾向掌控局面，記得也要信任他人。'
                        : avgControl >= 40
                        ? '你能很好地平衡掌控與放手。'
                        : '你傾向接納，可以嘗試更多主動行動。'}
                    </p>
                  </>
                );
              })()}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center text-gray-400 py-8">
              <Zap className="w-8 h-8 mb-2 opacity-20" />
              <span className="text-sm">尚無資料</span>
            </div>
          )}
        </div>

        {/* Personal Insights */}
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
          <div className="flex items-center gap-2 mb-6">
            <Brain className="w-5 h-5 text-primary" />
            <h3 className="font-bold text-lg">今日洞察</h3>
          </div>
          
          {tasks.length > 0 ? (
            <div className="space-y-3">
              {(() => {
                const avgControl = Math.round(tasks.reduce((sum, t) => sum + t.controlLevel, 0) / tasks.length);
                const topWorry = sources.length > 0 ? sources[0].name : null;
                
                return (
                  <>
                    <div className="flex gap-3 p-3 bg-gray-50 rounded-lg">
                      <Target className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                      <p className="text-sm text-gray-700">
                        <strong>課題分布：</strong> {myTasks} 個我的課題，{sharedTasks} 個共同課題，{theirTasks} 個他人課題
                      </p>
                    </div>
                    
                    {topWorry && (
                      <div className="flex gap-3 p-3 bg-gray-50 rounded-lg">
                        <Lightbulb className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                        <p className="text-sm text-gray-700">
                          <strong>主要困擾：</strong> 「{topWorry}」
                        </p>
                      </div>
                    )}
                    
                    <button 
                      onClick={() => navigate('journal')}
                      className="w-full mt-4 px-4 py-2 bg-primary/10 text-primary rounded-lg hover:bg-primary/20 transition-colors text-sm font-medium"
                    >
                      查看詳細分析 →
                    </button>
                  </>
                );
              })()}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center text-gray-400 py-8">
              <Brain className="w-8 h-8 mb-2 opacity-20" />
              <span className="text-sm">尚無資料</span>
            </div>
          )}
        </div>

      </div>

    </div>
  );
};
