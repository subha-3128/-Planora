// Timetable Data Structure
const TIMETABLE_DATA = [
    {
        id: 1,
        name: "Day Order 1",
        dayType: "productive",
        color: "from-slate-500 to-slate-700",
        bgColor: "bg-green-50 dark:bg-green-950",
        borderColor: "border-green-200 dark:border-green-800",
        textColor: "text-green-700 dark:text-green-300",
        tasks: [
            { id: 1, time: "6:30", activity: "Wake up", icon: "☀️", category: "wake" },
            { id: 2, time: "7:00 - 8:30", activity: "Gym", icon: "💪", category: "gym" },
            { id: 3, time: "9:00 - 12:00", activity: "Library", icon: "📚", category: "study" },
            { id: 4, time: "12:30 - 5:00", activity: "College", icon: "🎓", category: "college" },
            { id: 5, time: "Evening", activity: "Relax", icon: "🎮", category: "relax" },
            { id: 6, time: "11:30", activity: "Sleep", icon: "😴", category: "sleep" }
        ]
    },
    {
        id: 2,
        name: "Day Order 2",
        dayType: "productive",
        color: "from-sky-500 to-slate-600",
        bgColor: "bg-blue-50 dark:bg-blue-950",
        borderColor: "border-blue-200 dark:border-blue-800",
        textColor: "text-blue-700 dark:text-blue-300",
        tasks: [
            { id: 1, time: "7:00", activity: "Wake up", icon: "☀️", category: "wake" },
            { id: 2, time: "8:00 - 12:30", activity: "College", icon: "🎓", category: "college" },
            { id: 3, time: "1:30 - 4:30", activity: "Library", icon: "📚", category: "study" },
            { id: 4, time: "6:00 - 7:30", activity: "Gym", icon: "💪", category: "gym" },
            { id: 5, time: "11:30", activity: "Sleep", icon: "😴", category: "sleep" }
        ]
    },
    {
        id: 3,
        name: "Day Order 3",
        dayType: "productive",
        color: "from-stone-500 to-stone-700",
        bgColor: "bg-yellow-50 dark:bg-yellow-950",
        borderColor: "border-yellow-200 dark:border-yellow-800",
        textColor: "text-yellow-700 dark:text-yellow-300",
        tasks: [
            { id: 1, time: "6:30", activity: "Wake up", icon: "☀️", category: "wake" },
            { id: 2, time: "7:00 - 8:30", activity: "Gym", icon: "💪", category: "gym" },
            { id: 3, time: "9:00 - 12:00", activity: "Library", icon: "📚", category: "study" },
            { id: 4, time: "12:30 - 4:10", activity: "College", icon: "🎓", category: "college" },
            { id: 5, time: "Evening", activity: "Relax", icon: "🎮", category: "relax" },
            { id: 6, time: "11:30", activity: "Sleep", icon: "😴", category: "sleep" }
        ]
    },
    {
        id: 4,
        name: "Day Order 4",
        dayType: "productive",
        color: "from-rose-500 to-stone-700",
        bgColor: "bg-red-50 dark:bg-red-950",
        borderColor: "border-red-200 dark:border-red-800",
        textColor: "text-red-700 dark:text-red-300",
        tasks: [
            { id: 1, time: "6:30", activity: "Wake up", icon: "☀️", category: "wake" },
            { id: 2, time: "8:00 - 3:15", activity: "College", icon: "🎓", category: "college" },
            { id: 3, time: "4:30 - 6:00", activity: "Gym", icon: "💪", category: "gym" },
            { id: 4, time: "7:00 - 9:00", activity: "Library", icon: "📚", category: "study" },
            { id: 5, time: "9:30 - 10:30", activity: "Light Study", icon: "✏️", category: "study" },
            { id: 6, time: "11:30", activity: "Sleep", icon: "😴", category: "sleep" }
        ]
    },
    {
        id: 5,
        name: "Day Order 5",
        dayType: "productive",
        color: "from-indigo-500 to-slate-700",
        bgColor: "bg-purple-50 dark:bg-purple-950",
        borderColor: "border-purple-200 dark:border-purple-800",
        textColor: "text-purple-700 dark:text-purple-300",
        tasks: [
            { id: 1, time: "6:30", activity: "Wake up", icon: "☀️", category: "wake" },
            { id: 2, time: "8:00 - 10:00", activity: "College", icon: "🎓", category: "college" },
            { id: 3, time: "10:30 - 1:30", activity: "Library", icon: "📚", category: "study" },
            { id: 4, time: "5:30 - 7:00", activity: "Gym", icon: "💪", category: "gym" },
            { id: 5, time: "11:30", activity: "Sleep", icon: "😴", category: "sleep" }
        ]
    },
    {
        id: 6,
        name: "Saturday",
        dayType: "productive",
        color: "from-zinc-500 to-zinc-700",
        bgColor: "bg-amber-50 dark:bg-amber-950",
        borderColor: "border-amber-200 dark:border-amber-800",
        textColor: "text-amber-700 dark:text-amber-300",
        tasks: [
            { id: 1, time: "6:30", activity: "Wake up", icon: "☀️", category: "wake" },
            { id: 2, time: "7:00 - 8:30", activity: "Gym", icon: "💪", category: "gym" },
            { id: 3, time: "9:00 - 12:00", activity: "Library", icon: "📚", category: "study" },
            { id: 4, time: "12:00 - 2:00", activity: "Lunch + Rest", icon: "🍽️", category: "break" },
            { id: 5, time: "3:00 - 5:00", activity: "Deep Study", icon: "🧠", category: "study" },
            { id: 6, time: "5:00 - 7:00", activity: "Free Time", icon: "🎵", category: "relax" },
            { id: 7, time: "7:00 - Night", activity: "Chill", icon: "🎬", category: "relax" },
            { id: 8, time: "11:30", activity: "Sleep", icon: "😴", category: "sleep" }
        ]
    },
    {
        id: 7,
        name: "Sunday",
        dayType: "recovery",
        color: "from-slate-500 to-sky-600",
        bgColor: "bg-cyan-50 dark:bg-cyan-950",
        borderColor: "border-cyan-200 dark:border-cyan-800",
        textColor: "text-cyan-700 dark:text-cyan-300",
        tasks: [
            { id: 1, time: "8:00", activity: "Wake up", icon: "☀️", category: "wake" },
            { id: 2, time: "10:00 - 1:00", activity: "Library", icon: "📚", category: "study" },
            { id: 3, time: "1:00 - 4:00", activity: "Rest / Family", icon: "👨‍👩‍👧", category: "break" },
            { id: 4, time: "6:00 - 7:00", activity: "Weekly Planning", icon: "📋", category: "planning" },
            { id: 5, time: "7:00 - Night", activity: "Relax", icon: "🎮", category: "relax" },
            { id: 6, time: "11:30", activity: "Sleep", icon: "😴", category: "sleep" }
        ]
    }
];

// Get total tasks
function getTotalTasks() {
    return TIMETABLE_DATA.reduce((sum, day) => sum + day.tasks.length, 0);
}

// Get completed tasks from localStorage
function getCompletedTasks() {
    const completed = JSON.parse(localStorage.getItem('completedTasks') || '{}');
    return Object.values(completed).reduce((sum, dayTasks) => {
        return sum + Object.values(dayTasks).filter(v => v).length;
    }, 0);
}
