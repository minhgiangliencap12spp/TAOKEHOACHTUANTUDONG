import React, { useState, useEffect, useMemo } from 'react';
import { AppTab, PPCTEntry, ScheduleRow, EquipmentRow, EquipmentConfigEntry, DAYS_OF_WEEK, TimetableEntry } from './types';
import PPCTManager from './components/PPCTManager';
import ScheduleEditor from './components/ScheduleEditor';
import EquipmentEditor from './components/EquipmentEditor';
import EquipmentManager from './components/EquipmentManager';
import TimetableManager from './components/TimetableManager';
import { Layout, CalendarDays, FileText, Microscope, Settings2, CalendarCheck } from 'lucide-react';

const STORAGE_KEYS = {
  ACTIVE_TAB: 'TS_ACTIVE_TAB',
  PPCT: 'TS_PPCT_DATA',
  SCHEDULE: 'TS_SCHEDULE_DATA',
  EQUIPMENT: 'TS_EQUIPMENT_DATA',
  EQUIPMENT_CONFIG: 'TS_EQUIPMENT_CONFIG',
  SUBJECTS: 'TS_SUBJECTS',
  CLASSES: 'TS_CLASSES',
  CURRENT_WEEK: 'TS_CURRENT_WEEK',
  WEEK_START_DATE: 'TS_WEEK_START_DATE',
  TEACHER_NAME: 'TS_TEACHER_NAME',
  TIMETABLE_DATA: 'TS_TIMETABLE_DATA',
  TIMETABLE_FILE: 'TS_TIMETABLE_FILE'
};

const App: React.FC = () => {
  // Load the last active tab or default to TIMETABLE
  const [activeTab, setActiveTab] = useState<AppTab>(() => {
    return (localStorage.getItem(STORAGE_KEYS.ACTIVE_TAB) as AppTab) || AppTab.TIMETABLE;
  });

  // Save active tab whenever it changes
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ACTIVE_TAB, activeTab);
  }, [activeTab]);

  // Initialize state with lazy loading from localStorage
  const [ppctData, setPpctData] = useState<PPCTEntry[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.PPCT);
    return saved ? JSON.parse(saved) : [];
  });

  const [scheduleData, setScheduleData] = useState<ScheduleRow[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.SCHEDULE);
    return saved ? JSON.parse(saved) : [];
  });

  const [equipmentData, setEquipmentData] = useState<EquipmentRow[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.EQUIPMENT);
    return saved ? JSON.parse(saved) : [];
  });

  const [equipmentConfigData, setEquipmentConfigData] = useState<EquipmentConfigEntry[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.EQUIPMENT_CONFIG);
    return saved ? JSON.parse(saved) : [];
  });

  // Timetable State
  const [timetableData, setTimetableData] = useState<TimetableEntry[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.TIMETABLE_DATA);
    return saved ? JSON.parse(saved) : [];
  });
  
  const [timetableFileName, setTimetableFileName] = useState<string>(() => {
    return localStorage.getItem(STORAGE_KEYS.TIMETABLE_FILE) || '';
  });

  // Global Teacher Name State
  const [teacherName, setTeacherName] = useState<string>(() => {
    return localStorage.getItem(STORAGE_KEYS.TEACHER_NAME) || '';
  });

  // State for Global Configuration (Subjects & Classes) - Acts as storage persistence
  const [subjects, setSubjects] = useState<string[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.SUBJECTS);
    return saved ? JSON.parse(saved) : [
      'Toán(Đ)', 'Toán(H)', 'Ngữ Văn', 'Tiếng Anh', 'KHTN', 'Lịch Sử & ĐL', 'GDCD', 
      'Tin Học 7', 'Tin Học 9', 'Tin học 7', 'Tin học 9', 'Công Nghệ', 'HĐTN', 'GDTC', 'Âm Nhạc', 'Mỹ Thuật'
    ];
  });

  const [classes, setClasses] = useState<string[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.CLASSES);
    return saved ? JSON.parse(saved) : [
      '9D1', '9D2', '9D3', '9D4', '7B1', '7B2', '7B3', '7B4'
    ];
  });

  // Synchronized State for Week and Date
  const [currentWeek, setCurrentWeek] = useState<number>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.CURRENT_WEEK);
    return saved ? parseInt(saved, 10) : 13;
  });

  const [weekStartDate, setWeekStartDate] = useState<string>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.WEEK_START_DATE);
    return saved ? saved : new Date().toISOString().split('T')[0];
  });

  // Effects to save data whenever it changes
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.PPCT, JSON.stringify(ppctData));
  }, [ppctData]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SCHEDULE, JSON.stringify(scheduleData));
  }, [scheduleData]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.EQUIPMENT, JSON.stringify(equipmentData));
  }, [equipmentData]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.EQUIPMENT_CONFIG, JSON.stringify(equipmentConfigData));
  }, [equipmentConfigData]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.TEACHER_NAME, teacherName);
  }, [teacherName]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.TIMETABLE_DATA, JSON.stringify(timetableData));
  }, [timetableData]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.TIMETABLE_FILE, timetableFileName);
  }, [timetableFileName]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SUBJECTS, JSON.stringify(subjects));
  }, [subjects]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CLASSES, JSON.stringify(classes));
  }, [classes]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CURRENT_WEEK, currentWeek.toString());
  }, [currentWeek]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.WEEK_START_DATE, weekStartDate);
  }, [weekStartDate]);

  // Helper to normalize strings
  const normalizeStr = (s: string) => s.toLowerCase().replace(/\s+/g, '');

  // --- DERIVED DATA ---

  // 1. Filtered Schedule for Current Teacher
  const currentTeacherSchedule = useMemo(() => {
    return scheduleData.filter(row => 
      (row.teacherName || '').toLowerCase() === teacherName.toLowerCase()
    );
  }, [scheduleData, teacherName]);

  // 2. Filtered Equipment for Current Teacher
  const currentTeacherEquipment = useMemo(() => {
     return equipmentData.filter(row => (row.teacherName || '').toLowerCase() === teacherName.toLowerCase());
  }, [equipmentData, teacherName]);

  // 3. Filtered Subjects for Current Teacher
  // Logic: Only show subjects present in the Timetable OR Schedule history for this teacher.
  // This cleans up the UI to show only relevant subjects.
  const teacherSpecificSubjects = useMemo(() => {
    if (!teacherName) return subjects; // Fallback to global list if no teacher selected

    const subjectSet = new Set<string>();

    // Add subjects from Timetable
    timetableData
      .filter(t => (t.teacherName || '').toLowerCase().trim() === teacherName.toLowerCase().trim())
      .forEach(t => {
        if (t.subject) subjectSet.add(t.subject.trim());
      });

    // Add subjects from Schedule history (in case manually added)
    scheduleData
      .filter(s => (s.teacherName || '').toLowerCase().trim() === teacherName.toLowerCase().trim())
      .forEach(s => {
        if (s.subject) subjectSet.add(s.subject.trim());
      });

    // If we found specific subjects, return them sorted.
    // Otherwise (e.g. new teacher with no data), fallback to global subjects.
    if (subjectSet.size > 0) {
      return Array.from(subjectSet).sort();
    }
    
    return subjects;
  }, [teacherName, timetableData, scheduleData, subjects]);


  // --- AUTO-POPULATE LOGIC ---
  // When Timetable Data loads, ensure global Subjects/Classes are updated
  // so they are available in the "Settings" modal if needed.
  useEffect(() => {
    if (timetableData.length > 0 && teacherName) {
      let teacherEntries = timetableData.filter(d => 
        (d.teacherName || '').toLowerCase().trim() === teacherName.toLowerCase().trim()
      );

      // Fallback loose match
      if (teacherEntries.length === 0) {
        teacherEntries = timetableData.filter(d => 
          (d.teacherName || '').toLowerCase().includes(teacherName.toLowerCase())
        );
      }

      if (teacherEntries.length > 0) {
        const newSubjects = new Set<string>();
        const newClasses = new Set<string>();

        teacherEntries.forEach(entry => {
           if (entry.subject && entry.subject.trim()) {
             newSubjects.add(entry.subject.trim());
           }
           if (entry.className && entry.className.trim()) {
             newClasses.add(entry.className.trim());
           }
        });

        setSubjects(prev => {
           const merged = new Set([...prev, ...Array.from(newSubjects)]);
           return Array.from(merged).sort();
        });
        
        setClasses(prev => {
           const merged = new Set([...prev, ...Array.from(newClasses)]);
           return Array.from(merged).sort();
        });
      }
    }
  }, [timetableData, teacherName]);

  // Helper to calculate date string dd/MM from start date string dd/MM/YYYY and offset
  const getDayDate = (baseDate: string, daysToAdd: number): string => {
    if (!baseDate) return '';
    try {
      const parts = baseDate.split('-');
      if (parts.length !== 3) return '';
      const d = new Date(Date.UTC(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10)));
      if (isNaN(d.getTime())) return '';
      d.setUTCDate(d.getUTCDate() + daysToAdd);
      return d.toISOString().split('T')[0];
    } catch (e) {
      return '';
    }
  };

  const getLessonName = (subject: string, ppctNum: string): string => {
      if (!subject || !ppctNum) return '';
      const entry = ppctData.find(p => 
          normalizeStr(p.subject || '') === normalizeStr(subject) && 
          String(p.lessonNumber).trim() === String(ppctNum).trim()
      );
      return entry ? entry.lessonName : '';
  };

  // Logic: Apply Timetable to Schedule
  const handleApplyTimetable = (entries: TimetableEntry[]) => {
    if (entries.length > 0 && entries[0].teacherName) {
      setTeacherName(entries[0].teacherName);
    }
    
    const newRows = generateScheduleForWeek(currentWeek, weekStartDate, entries);
    
    setScheduleData(prevSchedule => {
       const otherRows = prevSchedule.filter(s => 
          (s.teacherName !== teacherName) || (s.week !== currentWeek)
       );
       return [...otherRows, ...newRows];
    });
    
    setActiveTab(AppTab.SCHEDULE);
    alert(`Đã áp dụng thời khóa biểu mẫu vào tuần ${currentWeek}.`);
  };

  // Sync Logic: Schedule -> Equipment
  const handleScheduleUpdate = (updatedTeacherSchedule: ScheduleRow[]) => {
    setScheduleData(prevGlobal => {
      const others = prevGlobal.filter(row => row.teacherName !== teacherName);
      const taggedRows = updatedTeacherSchedule.map(r => ({ ...r, teacherName }));
      return [...others, ...taggedRows];
    });

    setEquipmentData(prevGlobalEquipment => {
      const otherTeachersEquipment = prevGlobalEquipment.filter(e => e.teacherName !== teacherName);
      let myEquipment = prevGlobalEquipment.filter(e => e.teacherName === teacherName);
      
      const currentWeekScheduleRows = updatedTeacherSchedule.filter(s => s.week === currentWeek);

      currentWeekScheduleRows.forEach(schRow => {
        const eqIndex = myEquipment.findIndex(e =>
          e.week === schRow.week &&
          e.dayOfWeek === schRow.dayOfWeek &&
          e.period === schRow.period
        );

        const configEntry = equipmentConfigData.find(c => 
          normalizeStr(c.subject || '') === normalizeStr(schRow.subject || '') && 
          String(c.lessonNumber).trim() === String(schRow.ppctNumber).trim()
        );

        let nextEqName = '';
        let nextQty = '';

        if (eqIndex !== -1) {
          nextEqName = configEntry ? configEntry.equipmentName : myEquipment[eqIndex].equipmentName;
          if (configEntry && configEntry.quantity) {
             nextQty = configEntry.quantity;
          } else if (nextEqName) {
             nextQty = myEquipment[eqIndex].quantity || '1';
          } else {
             nextQty = '';
          }
          
          myEquipment[eqIndex] = {
            ...myEquipment[eqIndex],
            subject: schRow.subject,
            className: schRow.className,
            ppctNumber: schRow.ppctNumber,
            date: schRow.date,
            equipmentName: nextEqName,
            quantity: nextQty,
            teacherName: teacherName
          };
        } else {
          if (schRow.subject || schRow.className) {
            nextEqName = configEntry ? configEntry.equipmentName : '';
            nextQty = configEntry ? (configEntry.quantity || '1') : (nextEqName ? '1' : '');

            myEquipment.push({
              id: crypto.randomUUID(),
              week: schRow.week,
              dayOfWeek: schRow.dayOfWeek,
              date: schRow.date,
              period: schRow.period,
              subject: schRow.subject,
              className: schRow.className,
              ppctNumber: schRow.ppctNumber,
              equipmentName: nextEqName,
              quantity: nextQty,
              teacherName: teacherName
            });
          }
        }
      });

      return [...otherTeachersEquipment, ...myEquipment];
    });
  };

  const handleEquipmentUpdate = (updatedTeacherEquipment: EquipmentRow[]) => {
      setEquipmentData(prevGlobal => {
          const others = prevGlobal.filter(r => r.teacherName !== teacherName);
          const tagged = updatedTeacherEquipment.map(r => ({ ...r, teacherName }));
          return [...others, ...tagged];
      });
  };

  const generateScheduleForWeek = (week: number, startDate: string, entriesSource: TimetableEntry[] = []) => {
      let teacherEntries = entriesSource;
      
      if (teacherEntries.length === 0) {
         if (!teacherName || timetableData.length === 0) return [];
         teacherEntries = timetableData.filter(d => 
           (d.teacherName || '').toLowerCase().includes(teacherName.toLowerCase())
         );
      }

      if (teacherEntries.length === 0) return [];

      const counters: Record<string, number> = {}; 
      const myHistorySchedule = scheduleData.filter(s => s.teacherName === teacherName);
      
      myHistorySchedule.forEach(row => {
         if (row.week < week && row.subject && row.ppctNumber) {
            const key = `${normalizeStr(row.subject)}_${normalizeStr(row.className || '')}`;
            const match = String(row.ppctNumber).match(/\d+/);
            if (match) {
               const num = parseInt(match[0], 10);
               if (!isNaN(num)) counters[key] = Math.max(counters[key] || 0, num);
            }
         }
      });
      
      const sortedEntries = [...teacherEntries].sort((a, b) => {
         const da = DAYS_OF_WEEK.findIndex(d => normalizeStr(d) === normalizeStr(a.dayOfWeek) || a.dayOfWeek.includes(d));
         const db = DAYS_OF_WEEK.findIndex(d => normalizeStr(d) === normalizeStr(b.dayOfWeek) || b.dayOfWeek.includes(d));
         if (da !== db) return da - db;
         return a.period - b.period;
      });

      const newRows: ScheduleRow[] = [];
      sortedEntries.forEach(entry => {
         const dayIndex = DAYS_OF_WEEK.findIndex(d => 
            normalizeStr(d) === normalizeStr(entry.dayOfWeek) || 
            entry.dayOfWeek.toLowerCase().includes(d.toLowerCase())
         );
         if (dayIndex === -1) return;

         const dateStr = getDayDate(startDate, dayIndex);
         
         const key = `${normalizeStr(entry.subject)}_${normalizeStr(entry.className || '')}`;
         const currentMax = counters[key] || 0;
         const nextPPCT = currentMax + 1;
         counters[key] = nextPPCT; 

         const nextLessonName = getLessonName(entry.subject, nextPPCT.toString());

         newRows.push({
            id: crypto.randomUUID(),
            week: week,
            dayOfWeek: DAYS_OF_WEEK[dayIndex],
            date: dateStr,
            period: entry.period,
            subject: entry.subject,
            className: entry.className,
            ppctNumber: nextPPCT.toString(), 
            lessonName: nextLessonName,     
            notes: '',
            teacherName: teacherName
         });
      });

      return newRows;
  };

  // --- AUTO-POPULATE EFFECT ---
  useEffect(() => {
     if (!teacherName) return;

     const hasData = scheduleData.some(row => row.week === currentWeek && row.teacherName === teacherName);
     
     if (!hasData && timetableData.length > 0) {
         const newRows = generateScheduleForWeek(currentWeek, weekStartDate);
         if (newRows.length > 0) {
            setScheduleData(prev => {
                if (prev.some(r => r.week === currentWeek && r.teacherName === teacherName)) return prev;
                return [...prev, ...newRows];
            });
            
            setEquipmentData(prevEq => {
                 const others = prevEq.filter(e => e.teacherName !== teacherName);
                 const myNewEq: EquipmentRow[] = [];
                 
                 newRows.forEach(schRow => {
                    const configEntry = equipmentConfigData.find(c => 
                      normalizeStr(c.subject || '') === normalizeStr(schRow.subject || '') && 
                      String(c.lessonNumber).trim() === String(schRow.ppctNumber).trim()
                    );
                    myNewEq.push({
                      id: crypto.randomUUID(),
                      week: schRow.week,
                      dayOfWeek: schRow.dayOfWeek,
                      date: schRow.date,
                      period: schRow.period,
                      subject: schRow.subject,
                      className: schRow.className,
                      ppctNumber: schRow.ppctNumber,
                      equipmentName: configEntry ? configEntry.equipmentName : '',
                      quantity: configEntry ? (configEntry.quantity || '1') : '',
                      teacherName: teacherName
                    });
                 });
                 
                 const myExistingEq = prevEq.filter(e => e.teacherName === teacherName && e.week !== currentWeek);
                 return [...others, ...myExistingEq, ...myNewEq];
            });
         }
     }
  }, [currentWeek, teacherName, timetableData]);

  const handleWeekChange = (newWeek: number) => {
    const weekDiff = newWeek - currentWeek;
    setCurrentWeek(newWeek);

    if (weekStartDate && weekDiff !== 0) {
      try {
        const d = new Date(weekStartDate);
        if (!isNaN(d.getTime())) {
          d.setDate(d.getDate() + (7 * weekDiff));
          setWeekStartDate(d.toISOString().split('T')[0]);
        }
      } catch (e) {}
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-orange-50/30 text-slate-900 font-sans">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-pink-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-orange-400 to-pink-500 p-2.5 rounded-xl shadow-lg shadow-orange-200">
               <Layout className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-purple-600 via-pink-500 to-orange-500 bg-clip-text text-transparent hidden sm:block">
              TeacherScheduler AI
            </h1>
            <h1 className="text-xl font-bold bg-gradient-to-r from-purple-600 via-pink-500 to-orange-500 bg-clip-text text-transparent sm:hidden">
              TS AI
            </h1>
          </div>
          
          <nav className="flex gap-1 bg-pink-50 p-1 rounded-xl border border-pink-100 overflow-x-auto max-w-full custom-scrollbar">
            <button
              onClick={() => setActiveTab(AppTab.TIMETABLE)}
              className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg text-sm font-bold transition-all whitespace-nowrap ${
                activeTab === AppTab.TIMETABLE 
                  ? 'bg-white text-violet-600 shadow-md shadow-violet-100' 
                  : 'text-slate-500 hover:text-violet-500'
              }`}
            >
              <CalendarCheck className="w-4 h-4" />
              <span className="hidden sm:inline">1. Thời khóa biểu</span>
              <span className="sm:hidden">1. TKB</span>
            </button>

            <button
              onClick={() => setActiveTab(AppTab.PPCT)}
              className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg text-sm font-bold transition-all whitespace-nowrap ${
                activeTab === AppTab.PPCT 
                  ? 'bg-white text-orange-600 shadow-md shadow-orange-100' 
                  : 'text-slate-500 hover:text-orange-500'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span className="hidden sm:inline">2. Cấu hình PPCT</span>
              <span className="sm:hidden">2. PPCT</span>
            </button>

            <button
              onClick={() => setActiveTab(AppTab.DEVICE_LIST)}
              className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg text-sm font-bold transition-all whitespace-nowrap ${
                activeTab === AppTab.DEVICE_LIST 
                  ? 'bg-white text-teal-600 shadow-md shadow-teal-100' 
                  : 'text-slate-500 hover:text-teal-500'
              }`}
            >
              <Settings2 className="w-4 h-4" />
              <span className="hidden sm:inline">3. Cấu hình TB</span>
              <span className="sm:hidden">3. Cấu hình TB</span>
            </button>

            <button
              onClick={() => setActiveTab(AppTab.SCHEDULE)}
              className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg text-sm font-bold transition-all whitespace-nowrap ${
                activeTab === AppTab.SCHEDULE 
                  ? 'bg-white text-pink-600 shadow-md shadow-pink-100' 
                  : 'text-slate-500 hover:text-pink-500'
              }`}
            >
              <CalendarDays className="w-4 h-4" />
              <span className="hidden sm:inline">4. Lịch Báo Giảng</span>
              <span className="sm:hidden">4. LBG</span>
            </button>

            <button
              onClick={() => setActiveTab(AppTab.EQUIPMENT)}
              className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg text-sm font-bold transition-all whitespace-nowrap ${
                activeTab === AppTab.EQUIPMENT
                  ? 'bg-white text-cyan-600 shadow-md shadow-cyan-100' 
                  : 'text-slate-500 hover:text-cyan-500'
              }`}
            >
              <Microscope className="w-4 h-4" />
              <span className="hidden sm:inline">5. Phiếu Thiết Bị</span>
              <span className="sm:hidden">5. PTB</span>
            </button>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto w-full p-4 md:p-6 overflow-hidden flex flex-col">
        {activeTab === AppTab.TIMETABLE && (
          <div className="flex-1 h-full min-h-[500px]">
             <TimetableManager
               onApply={handleApplyTimetable}
               savedData={timetableData}
               savedFileName={timetableFileName}
               onUpdateData={setTimetableData}
               onUpdateFileName={setTimetableFileName}
               teacherName={teacherName}
               onUpdateTeacherName={setTeacherName}
             />
          </div>
        )}
        {activeTab === AppTab.PPCT && (
          <div className="flex-1 h-full min-h-[500px]">
             <PPCTManager 
               data={ppctData} 
               onUpdate={(newData) => {
                 setPpctData(newData);
               }}
               availableSubjects={teacherSpecificSubjects} 
             />
          </div>
        )}
        {activeTab === AppTab.DEVICE_LIST && (
           <div className="flex-1 h-full min-h-[500px]">
             <EquipmentManager
               data={equipmentConfigData}
               onUpdate={(newData) => setEquipmentConfigData(newData)}
               availableSubjects={teacherSpecificSubjects}
             />
           </div>
        )}
        {activeTab === AppTab.SCHEDULE && (
          <div className="flex-1 h-full min-h-[500px]">
            <ScheduleEditor 
              schedule={currentTeacherSchedule}
              ppct={ppctData}
              onUpdateSchedule={handleScheduleUpdate}
              availableSubjects={teacherSpecificSubjects}
              onUpdateSubjects={setSubjects}
              availableClasses={classes}
              onUpdateClasses={setClasses}
              currentWeek={currentWeek}
              onWeekChange={handleWeekChange}
              weekStartDate={weekStartDate}
              onDateChange={setWeekStartDate}
              teacherName={teacherName}
              onTeacherNameChange={setTeacherName}
              referenceTimetable={timetableData}
              onApplyReference={handleApplyTimetable}
            />
          </div>
        )}
        {activeTab === AppTab.EQUIPMENT && (
          <div className="flex-1 h-full min-h-[500px]">
            <EquipmentEditor
              data={currentTeacherEquipment}
              equipmentConfig={equipmentConfigData}
              onUpdate={handleEquipmentUpdate}
              availableSubjects={teacherSpecificSubjects}
              onUpdateSubjects={setSubjects}
              availableClasses={classes}
              onUpdateClasses={setClasses}
              currentWeek={currentWeek}
              onWeekChange={handleWeekChange}
              weekStartDate={weekStartDate}
              onDateChange={setWeekStartDate}
              teacherName={teacherName}
              onTeacherNameChange={setTeacherName}
            />
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-orange-100 py-4 mt-auto">
        <div className="max-w-7xl mx-auto px-4 text-center text-xs text-slate-400">
          <p>TeacherScheduler AI © 2024. Hỗ trợ bởi Google Gemini.</p>
        </div>
      </footer>
    </div>
  );
};

export default App;