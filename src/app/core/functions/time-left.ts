export default function TimeLeft(task: any): void {
    // Calculate the local start and end dates of the task.
    const startDate = new Date(new Date(task.startDate).setMinutes(new Date(task.startDate).getMinutes() - new Date().getTimezoneOffset()));
    const endDate = new Date(new Date(task.endDate).setMinutes(new Date(task.endDate).getMinutes() - new Date().getTimezoneOffset()));

    // Calculate the duration and remaining time of the task.
    const duration = endDate.getTime() - startDate.getTime();
    const remaining = endDate.getTime() - new Date().getTime();

    // Set the bullet color of the task based on the remaining time.
    task.bullet = duration / 2 > remaining ? "bg-warning" : "bg-primary";

    // Calculate the time left in months, days, hours, and minutes.
    const months = Math.floor(remaining / (1000 * 60 * 60 * 24 * 30));
    const days = Math.floor(remaining / (1000 * 60 * 60 * 24));
    const hours = Math.floor((remaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));

    // Set the time left and time left label of the task.
    if (months >= 1) {
        task.timeLeft = months;
    } else if (days >= 1) {
        task.timeLeft = days;
    } else if (hours >= 1) {
        task.timeLeft = hours;
    } else if (minutes >= 1) {
        task.timeLeft = minutes;
    }
    task.timeLeftLabel = months > 0 ? "month" : days > 0 ? "day" : hours > 0 ? "hour" : "minute";
}
