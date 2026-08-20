# Smart Study Planner — Functional Requirements

## 1. Authentication & Account Management

### FR-01 — User Registration

The system shall allow a new user to create an account using:

* Name
* Email
* Password
* Role: Student or Teacher

### FR-02 — User Login

The system shall allow registered users to log in using their email and password.

### FR-03 — User Logout

The system shall allow authenticated users to log out of their account.

### FR-04 — Profile Management

Users shall be able to:

* View their profile
* Update their name
* Update their email
* Change their password

### FR-05 — Role-Based Access

The system shall provide different functionality based on the user's role:

* Student
* Teacher

Users shall only be able to access features permitted for their role.

---

# 2. Student Functional Requirements

The **Student** is the primary user of the application.

## 2.1 Dashboard

### FR-S01 — Student Dashboard

The system shall provide students with a dashboard containing an overview of their academic activities.

The dashboard shall display:

* Tasks due today
* Overdue tasks
* Upcoming exams
* Today's classes
* Upcoming study sessions
* Completed tasks
* Study hours
* Basic progress statistics

### FR-S02 — Today's Schedule

The student shall be able to view their classes, exams, tasks and study sessions scheduled for the current day.

---

# 3. Subject Management

### FR-S03 — Create Subject

Students shall be able to create a subject by providing:

* Subject name
* Subject code
* Description
* Color

Example:

```text
Software Architecture
CS603
```

### FR-S04 — View Subjects

Students shall be able to view all subjects associated with their account.

### FR-S05 — Update Subject

Students shall be able to modify subject information.

### FR-S06 — Delete Subject

Students shall be able to delete a subject.

The system should warn the student before deleting a subject that has associated tasks, exams or classes.

### FR-S07 — Subject Details

Students shall be able to view a subject's:

* Tasks
* Exams
* Classes
* Study sessions
* Progress

---

# 4. Task Management

Tasks are one of the core features of the application.

### FR-S08 — Create Task

Students shall be able to create tasks containing:

* Title
* Description
* Subject
* Task type
* Due date
* Priority

Task types shall include:

```text
Assignment
Homework
Revision
Reminder
General
```

### FR-S09 — View Tasks

Students shall be able to view their tasks.

### FR-S10 — Update Task

Students shall be able to modify an existing task.

### FR-S11 — Delete Task

Students shall be able to delete a task.

### FR-S12 — Complete Task

Students shall be able to mark a task as completed.

### FR-S13 — Reopen Task

Students shall be able to change a completed task back to pending.

### FR-S14 — Task Filtering

Students shall be able to filter tasks by:

* Status
* Priority
* Subject
* Task type
* Due date

### FR-S15 — Task Sorting

Students shall be able to sort tasks by:

* Due date
* Priority
* Creation date

### FR-S16 — Overdue Tasks

The system shall automatically identify tasks whose due date has passed and which are still incomplete.

---

# 5. Exam Management

### FR-S17 — Create Exam

Students shall be able to create an exam containing:

* Exam title
* Subject
* Date
* Start time
* End time
* Location
* Description

### FR-S18 — View Exams

Students shall be able to view upcoming and past exams.

### FR-S19 — Update Exam

Students shall be able to modify exam information.

### FR-S20 — Delete Exam

Students shall be able to delete an exam.

### FR-S21 — Upcoming Exams

The system shall display upcoming exams on the dashboard.

### FR-S22 — Exam Revision Tasks

Students shall be able to create revision tasks associated with a particular exam.

For example:

```text
Exam:
CS603 Final Exam

Revision:
□ Read Chapter 1
□ Read Chapter 2
□ Practice past papers
```

This is a nice feature because it connects **Exams → Tasks** instead of making them isolated CRUD features.

---

# 6. Class / Timetable Management

### FR-S23 — Add Class

Students shall be able to add a class containing:

* Subject
* Day of week
* Start time
* End time
* Room
* Status

### FR-S24 — View Timetable

Students shall be able to view their timetable in:

* Daily view
* Weekly view

### FR-S25 — Update Class

Students shall be able to modify class information.

### FR-S26 — Delete Class

Students shall be able to remove a class from their timetable.

### FR-S27 — Class Conflict Detection

The system should detect conflicting classes.

Example:

```text
CS603
10:00 — 11:00

CS601
10:30 — 11:30
```

The system should warn the student about the conflict.

---

# 7. Study Session Management

### FR-S28 — Create Study Session

Students shall be able to schedule a study session containing:

* Title
* Subject
* Date
* Start time
* End time
* Notes

### FR-S29 — View Study Sessions

Students shall be able to view scheduled study sessions.

### FR-S30 — Update Study Session

Students shall be able to modify a study session.

### FR-S31 — Delete Study Session

Students shall be able to delete a study session.

### FR-S32 — Track Study Time

The system shall calculate the amount of time allocated to study sessions.

For example:

```text
This Week

CS603       4h 30m
CS601       2h 00m
CS602       3h 15m

Total       9h 45m
```

---

# 8. Calendar

### FR-S33 — Academic Calendar

The system shall provide a calendar containing the student's:

* Classes
* Exams
* Tasks
* Study sessions

### FR-S34 — Calendar Views

Students shall be able to switch between:

* Month
* Week
* Day

### FR-S35 — Calendar Event Details

Students shall be able to select an event and view its details.

---

# 9. Notifications & Reminders

For the **first version**, I'd keep this relatively simple.

### FR-S36 — Upcoming Task Reminder

The system shall display reminders for upcoming tasks.

### FR-S37 — Overdue Task Notification

The system shall notify/display a warning when a task becomes overdue.

### FR-S38 — Upcoming Exam Reminder

The system shall display reminders for upcoming exams.

### FR-S39 — Upcoming Class Reminder

The system shall display reminders for upcoming classes.

> We don't need to implement browser push notifications initially. In-app notifications/reminders are enough for the MVP.

---

# 10. Student Progress

### FR-S40 — Task Progress

The system shall calculate the student's task completion rate.

Example:

```text
Tasks Completed
     18 / 25

Progress
██████████████░░ 72%
```

### FR-S41 — Study Statistics

The system shall display study statistics such as:

* Study hours this week
* Study hours per subject
* Completed tasks
* Pending tasks
* Overdue tasks

### FR-S42 — Subject Progress

The student shall be able to view their activity/progress for individual subjects.

---

# 11. Teacher Functional Requirements

The teacher role is intentionally smaller than the student role.

## 11.1 Teacher Dashboard

### FR-T01 — Teacher Dashboard

The system shall provide teachers with an overview of their timetable-sharing activities.

The dashboard shall display:

* Created timetables
* Shared timetables
* Number of students with access

---

# 12. Teacher Timetable Management

### FR-T02 — Create Timetable

Teachers shall be able to create a timetable containing:

* Subject
* Day
* Start time
* End time
* Room
* Academic term/semester

### FR-T03 — Update Timetable

Teachers shall be able to modify timetable information.

### FR-T04 — Delete Timetable

Teachers shall be able to remove timetable entries.

### FR-T05 — View Timetable

Teachers shall be able to view their created timetable in a weekly format.

---

# 13. Timetable Sharing

This is the main teacher-specific feature.

### FR-T06 — Share Timetable

Teachers shall be able to share their timetable with students.

### FR-T07 — Select Students

Teachers shall be able to select students who should receive access to a timetable.

### FR-T08 — Student Access

Students who have been granted access shall be able to view the shared timetable.

### FR-T09 — Revoke Access

Teachers shall be able to revoke a student's access to a shared timetable.

### FR-T10 — Shared Timetable Identification

Students shall be able to distinguish between:

```text
My Timetable
```

and:

```text
Shared by Teacher
```

---

# 14. Authorization & Data Security

These aren't flashy features, but they're **very important for your portfolio**.

### FR-C01 — User Data Isolation

A student shall only be able to access their own:

* Subjects
* Tasks
* Exams
* Classes
* Study sessions

### FR-C02 — Teacher Data Isolation

A teacher shall only be able to modify their own timetables.

### FR-C03 — Protected Routes

Authenticated pages shall not be accessible to unauthenticated users.

### FR-C04 — Role Protection

Students shall not be able to access teacher-only functionality.

Teachers shall not be able to modify student-owned academic data unless explicitly permitted.

### FR-C05 — Ownership Validation

The backend shall verify that a resource belongs to the current user before allowing it to be updated or deleted.

For example:

```text
DELETE /api/tasks/123
```

doesn't simply mean:

> "Delete task 123."

It means:

> "Delete task 123 **only if task 123 belongs to the authenticated user**."

This is an excellent thing to demonstrate in your project.

---

# 15. System-Level Functional Requirements

These apply to both roles.

### FR-C06 — Search

Users should be able to search their academic data.

Initially, search can cover:

* Subjects
* Tasks
* Exams

### FR-C07 — Responsive Interface

The application shall work on:

* Desktop
* Tablet
* Mobile browser

### FR-C08 — Form Validation

The system shall validate user input before saving data.

### FR-C09 — Error Handling

The system shall display meaningful error messages when an operation fails.

### FR-C10 — Empty States

The system shall display appropriate messages when no data exists.

Example:

> "You don't have any upcoming exams."

rather than showing a blank page.

---

# Final Role Breakdown

So your overall system becomes:

```text
                    SMART STUDY PLANNER
                           │
             ┌─────────────┴─────────────┐
             │                           │
          STUDENT                     TEACHER
             │                           │
     ┌───────┼────────┐          ┌───────┴────────┐
     │       │        │          │                │
 Subjects   Tasks    Exams    Timetable       Sharing
     │       │        │          │                │
     └───────┼────────┘          └───────┬────────┘
             │                           │
         Classes                   Shared Access
             │
      Study Sessions
             │
         Calendar
             │
         Dashboard
             │
        Statistics
```

### MVP boundary I'd recommend

For your **first complete version**, implement:

**Student**

* Authentication
* Dashboard
* Subjects
* Tasks
* Exams
* Classes
* Study Sessions
* Calendar
* Basic statistics

**Teacher**

* Authentication
* Dashboard
* Timetable
* Share timetable
* Revoke student access

**Security**

* Authentication
* Role authorization
* Resource ownership

Then leave these as **future enhancements**:

* Browser push notifications
* Offline mode
* Mobile app
* Institution/school management
* Google Calendar integration
* Advanced analytics
* Recurring classes
* Email notifications

This gives you a project that's **large enough to demonstrate real full-stack engineering but still realistic for one person building it from scratch**.
