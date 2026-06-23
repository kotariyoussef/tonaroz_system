# Scheduling & Timetable Module — Full Audit Report
**Project:** `school_erp` (Tonaroz System)
**Date:** 2026-06-23
**Auditor:** Antigravity (Senior Django Architect)

---

## 1. Inventory of Scheduling-Related Files

| File | Role |
|------|------|
| [models.py](file:///c:/Users/ACA%2010/Documents/ss/school_erp/core/models.py) | `Room`, `CourseGroup`, `CourseGroupSchedule`, `Session`, `Attendance`, `Enrollment` |
| [views.py](file:///c:/Users/ACA%2010/Documents/ss/school_erp/core/views.py) | 16 scheduling-related views |
| [forms.py](file:///c:/Users/ACA%2010/Documents/ss/school_erp/core/forms.py) | `SessionForm`, `CourseGroupScheduleFormSet` |
| [utils.py](file:///c:/Users/ACA%2010/Documents/ss/school_erp/core/utils.py) | `generate_sessions_from_coursegroups`, `detect_all_conflicts`, `_annotate_conflicts`, `_build_room_schedule`, `_build_teacher_schedule`, `check_schedule_conflicts`, `check_teacher_schedule_conflicts`, `auto_generate_future_sessions` |
| [urls.py](file:///c:/Users/ACA%2010/Documents/ss/school_erp/core/urls.py) | 15 scheduling routes |
| [sessions_schedule.html](file:///c:/Users/ACA%2010/Documents/ss/school_erp/templates/core/sessions_schedule.html) | Weekly grid view (room & teacher modes) |
| [sessions_today.html](file:///c:/Users/ACA%2010/Documents/ss/school_erp/templates/core/sessions_today.html) | Daily session list |
| [session_attendance.html](file:///c:/Users/ACA%2010/Documents/ss/school_erp/templates/core/session_attendance.html) | Attendance checklist per session |
| [session_exceptions_list.html](file:///c:/Users/ACA%2010/Documents/ss/school_erp/templates/core/session_exceptions_list.html) | Exception/deviation log |
| [schedule_conflicts.html](file:///c:/Users/ACA%2010/Documents/ss/school_erp/templates/core/schedule_conflicts.html) | Conflict dashboard |
| [session_generate.html](file:///c:/Users/ACA%2010/Documents/ss/school_erp/templates/core/session_generate.html) | Bulk session generation form |
| [session_form.html](file:///c:/Users/ACA%2010/Documents/ss/school_erp/templates/core/session_form.html) | Manual session create/edit |

---

## 2. Feature Status Table

### Core Scheduling

| Feature | Status | Notes |
|---------|--------|-------|
| Class (group) scheduling | ✅ **Complete** | `CourseGroupSchedule` with day + time + room |
| Weekly schedule templates | ✅ **Complete** | Per-group recurring weekly slots |
| Session (occurrence) generation | ✅ **Complete** | `generate_sessions_from_coursegroups()` + auto-generation on view access |
| Recurring schedule generation | ✅ **Complete** | Auto-generates up to 4 weeks ahead; signal-driven on model save |
| Group schedules | ✅ **Complete** | Full CRUD via inline formset on `CourseGroupForm` |
| Private lesson scheduling | ❌ **Missing** | No 1-to-1 session type or private group concept |
| Monthly schedule view | ⚠️ **Partial** | Weekly view only; monthly calendar UI absent |
| Timetable export (PDF/iCal) | ❌ **Missing** | No export of timetable |

### Teacher Scheduling

| Feature | Status | Notes |
|---------|--------|-------|
| Teacher workload tracking | ⚠️ **Partial** | `calculate_teacher_hours()` in utils; surfaced on payroll page only |
| Teacher timetable view | ⚠️ **Partial** | Weekly grid has teacher-mode; no dedicated teacher portal/calendar |
| Double-booking prevention | ✅ **Complete** | Validated in both `CourseGroupSchedule.clean()` and `Session.clean()` |
| Teacher substitution | ✅ **Complete** | `Session.substitute_teacher` FK; tracked in exceptions list |
| Teacher availability model | ❌ **Missing** | No model for defining when a teacher is available/unavailable |
| Leave & absence handling | ❌ **Missing** | No `TeacherLeave` model; cancellations are manual per session |
| Teacher-facing self-service | ❌ **Missing** | No teacher login / self-service portal |

### Student Scheduling

| Feature | Status | Notes |
|---------|--------|-------|
| Student timetable | ⚠️ **Partial** | Student detail page shows enrollments/schedules; no calendar view |
| Enrollment-based schedule display | ✅ **Complete** | `Enrollment` → `CourseGroup` → `CourseGroupSchedule` chain works |
| Student schedule conflict detection | ❌ **Missing** | System does not check if a student is double-booked across groups |
| Schedule changes / transfers | ⚠️ **Partial** | Admin can change enrollment; no guided transfer UI |
| Makeup sessions | ❌ **Missing** | No makeup session model or workflow |
| Class absence notification | ⚠️ **Partial** | WhatsApp absence notification exists; not linked to makeup scheduling |

### Room Scheduling

| Feature | Status | Notes |
|---------|--------|-------|
| Room assignment | ✅ **Complete** | Required on both `CourseGroupSchedule` and `Session` |
| Room availability tracking | ✅ **Complete** | `get_room_availability()` utility; room grid in weekly view |
| Capacity validation | ✅ **Complete** | `_annotate_conflicts()` checks enrolled count vs. `Room.capacity` |
| Double-booking prevention | ✅ **Complete** | Validated in `CourseGroupSchedule.clean()` and `Session.clean()` |
| Equipment/resource assignment | ❌ **Missing** | `Room` model has only `name` and `capacity` |

### Conflict Detection

| Feature | Status | Notes |
|---------|--------|-------|
| Teacher conflicts | ✅ **Complete** | Both schedule and session level; AJAX real-time check |
| Room conflicts | ✅ **Complete** | Both schedule and session level; AJAX real-time check |
| Student conflicts | ❌ **Missing** | No cross-group double-booking check for students |
| Capacity violations | ✅ **Complete** | Tracked in conflict dashboard |
| Overlapping session detection | ✅ **Complete** | `detect_all_conflicts()` scans future sessions |
| Conflict dashboard | ✅ **Complete** | `/schedule/conflicts/` with badge count in sidebar |

### Calendar Features

| Feature | Status | Notes |
|---------|--------|-------|
| Daily view | ✅ **Complete** | `sessions_today` with date navigation |
| Weekly grid view (room-based) | ✅ **Complete** | `sessions_schedule` |
| Weekly grid view (teacher-based) | ✅ **Complete** | `view_mode=teacher` toggle |
| Monthly view | ❌ **Missing** | No monthly calendar template or view |
| Student personal calendar | ❌ **Missing** | No student-facing timetable page |
| Room calendar | ✅ **Complete** | Embedded in weekly grid (room mode) |
| Branch calendar | ❌ **Missing** | Single-branch system; no multi-branch concept |
| iCal / external calendar sync | ❌ **Missing** | No `.ics` export |

### Schedule Management

| Feature | Status | Notes |
|---------|--------|-------|
| Schedule creation | ✅ **Complete** | Via `CourseGroupForm` inline formset |
| Schedule editing | ✅ **Complete** | Inline formset on edit page |
| Session cancellation | ✅ **Complete** | Quick status update + AJAX endpoint |
| Session rescheduling | ✅ **Complete** | `session_update_ajax` + AJAX on weekly grid |
| Bulk session generation | ✅ **Complete** | `/sessions/generate/` view |
| Session exception reset | ✅ **Complete** | `session_reset_to_default_ajax` |
| Exception/deviation log | ✅ **Complete** | `/sessions/exceptions/` |
| Holiday handling | ❌ **Missing** | No `Holiday` model; sessions must be cancelled manually |
| Semester/term management | ❌ **Missing** | No `Term`/`Semester` model |
| Session status tracking | ✅ **Complete** | PLANNED / DONE / CANCELLED |

### Attendance Integration

| Feature | Status | Notes |
|---------|--------|-------|
| Attendance linked to sessions | ✅ **Complete** | `session_attendance` view pulls group students for the session date |
| Open attendance from timetable | ✅ **Complete** | Direct link from daily view to `session_attendance` |
| Missed class tracking | ⚠️ **Partial** | `Attendance.is_present=False` records exist; no aggregated absent report |
| Makeup class assignment | ❌ **Missing** | No makeup session workflow |
| Auto-close attendance for DONE sessions | ❌ **Missing** | Attendance can be saved even after session status changes |

### Notification Integration

| Feature | Status | Notes |
|---------|--------|-------|
| Session reminder (WhatsApp) | ✅ **Complete** | `whatsapp_session_reminder` view + template |
| Absence notification (WhatsApp) | ✅ **Complete** | `whatsapp_absence_notifications` view + template |
| Schedule change notification | ❌ **Missing** | No automated notification when session is rescheduled |
| Cancellation notification | ❌ **Missing** | No notification triggered on `CANCELLED` status |
| Teacher notification | ❌ **Missing** | Teacher phone not exposed in notifications system |
| Upcoming class bulk reminders | ✅ **Complete** | `whatsapp_session_reminder` supports bulk for a session |

---

## 3. Missing Features Analysis

### 🔴 Critical (Required for Daily Operations)

---

#### 3.1 Holiday & School Closure Management

**Why needed:** Without a holiday calendar, staff must manually cancel each individual session for every public holiday, religious festival, or school closure day. A single holiday could require 10–20 manual cancellations.

**Business value:** Saves 15–30 minutes of admin time per holiday; prevents "ghost" sessions appearing in conflict reports and attendance.

**Recommended Model:**
```python
class Holiday(models.Model):
    name = models.CharField(max_length=100, verbose_name="Nom du congé")
    date = models.DateField(unique=True, verbose_name="Date")
    affects_all = models.BooleanField(default=True, verbose_name="Tous les groupes")
    affected_groups = models.ManyToManyField(
        'CourseGroup', blank=True, related_name='holidays', verbose_name="Groupes affectés"
    )
    class Meta:
        ordering = ['date']
```

**Required views:** `holiday_list`, `holiday_create`, `holiday_delete`; integrate into `generate_sessions_from_coursegroups()` to skip holiday dates.

**Required templates:** `holidays_list.html`, `holiday_form.html`

**Required permissions:** Staff-only CRUD; no student/parent access.

---

#### 3.2 Student Schedule Conflict Detection

**Why needed:** A student can currently be enrolled in two groups that meet at the same time. The system does not warn about this.

**Business value:** Prevents student dissatisfaction and billing disputes from impossible schedules.

**Recommended approach:** Add `clean()` to `Enrollment` model:
```python
def clean(self):
    # Check if any schedule of the new group overlaps with existing enrollments
    new_schedules = self.course_group.schedules.all()
    existing_enrollments = Enrollment.objects.filter(
        student=self.student, is_active=True
    ).exclude(pk=self.pk)
    for existing in existing_enrollments:
        for existing_sch in existing.course_group.schedules.all():
            for new_sch in new_schedules:
                if new_sch.day == existing_sch.day:
                    if (new_sch.start_time < existing_sch.end_time and
                            new_sch.end_time > existing_sch.start_time):
                        raise ValidationError(
                            f"L'élève est déjà inscrit au groupe "
                            f"'{existing.course_group.name}' "
                            f"le {new_sch.get_day_display()} "
                            f"de {existing_sch.start_time:%H:%M} "
                            f"à {existing_sch.end_time:%H:%M}."
                        )
```

**Required views:** No new view; modify `enrollment_add` to surface the error clearly.

**Required templates:** Update `enrollment_add` inline error display.

**Required permissions:** Admin-only; warn but allow override.

---

#### 3.3 Monthly Calendar View

**Why needed:** The weekly grid is excellent for operational planning but parents and students need to see the full month at a glance. It is the most requested feature in school management systems.

**Business value:** Reduces inbound "what day is class?" queries from parents by 80%.

**Required view:**
```python
def sessions_monthly(request):
    # Returns sessions organized in a month grid
    # Supports navigation: prev/next month
    # Filters by group, teacher, room
```

**Required template:** `sessions_monthly.html` — standard calendar grid with session badges.

**Required URL:** `path('schedule/monthly/', views.sessions_monthly, name='sessions_monthly')`

**Required permissions:** View-only for staff; read-only public endpoint optional.

---

### 🟡 Important (Improves Operational Efficiency)

---

#### 3.4 Teacher Availability & Leave Model

**Why needed:** Currently there is no way to record that a teacher is unavailable on a given date or time range. This means substitution planning is done manually outside the system.

**Business value:** Reduces scheduling errors; enables automated substitute suggestions.

**Recommended Models:**
```python
class TeacherLeave(models.Model):
    LEAVE_TYPE_CHOICES = [
        ('SICK', 'Maladie'),
        ('VACATION', 'Congé'),
        ('OTHER', 'Autre'),
    ]
    teacher = models.ForeignKey(Teacher, on_delete=models.CASCADE, related_name='leaves')
    start_date = models.DateField()
    end_date = models.DateField()
    leave_type = models.CharField(max_length=10, choices=LEAVE_TYPE_CHOICES, default='OTHER')
    notes = models.TextField(blank=True)

class TeacherAvailability(models.Model):
    teacher = models.ForeignKey(Teacher, on_delete=models.CASCADE, related_name='availability')
    day = models.CharField(max_length=3, choices=CourseGroup.DAYS_CHOICES)
    start_time = models.TimeField()
    end_time = models.TimeField()
    is_available = models.BooleanField(default=True)
```

**Required views:** `teacher_leave_create`, `teacher_leave_list`, `teacher_availability`

**Required permissions:** Admin creates leaves; teachers should eventually self-report.

---

#### 3.5 Makeup Session Workflow

**Why needed:** When a session is cancelled, students lose a paid class. The system needs a formal process for scheduling makeup sessions.

**Business value:** Reduces parent complaints about missed sessions; improves perceived service quality.

**Recommended Model:**
```python
class MakeupSession(models.Model):
    original_session = models.ForeignKey(
        Session, on_delete=models.SET_NULL, null=True,
        related_name='makeup_sessions', verbose_name="Séance originale"
    )
    makeup_session = models.ForeignKey(
        Session, on_delete=models.CASCADE,
        related_name='is_makeup_for', verbose_name="Séance de rattrapage"
    )
    students = models.ManyToManyField(Student, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    notes = models.TextField(blank=True)
```

**Required views:** `makeup_session_create`, `makeup_session_list`

**Required templates:** `makeup_session_form.html`, `makeup_sessions_list.html`

---

#### 3.6 Semester / Term Management

**Why needed:** The system generates sessions indefinitely with no concept of a school year term. This makes payroll calculations and session counting ambiguous.

**Business value:** Enables term-based reports; clean academic year boundaries.

**Recommended Model:**
```python
class AcademicTerm(models.Model):
    name = models.CharField(max_length=100, verbose_name="Nom du terme")
    start_date = models.DateField()
    end_date = models.DateField()
    is_active = models.BooleanField(default=True)
    class Meta:
        ordering = ['-start_date']
```

---

#### 3.7 Absence Aggregation Report

**Why needed:** `Attendance` records `is_present=False` but there is no view that shows "Student X has been absent N times this month" or "Group Y has 30% absence rate."

**Business value:** Enables early intervention for at-risk students.

**Required view:** `attendance_report` — filters by student, group, date range; shows counts and percentage.

**Required template:** `attendance_report.html` with sortable table and export.

---

### 🔵 Advanced (Future Enhancements)

---

#### 3.8 iCal / Google Calendar Export

**Why needed:** Teachers and students should be able to sync their schedule into their phone calendar.

**Business value:** Eliminates "I forgot my schedule" absences.

**Implementation:** `pip install icalendar`; add `/schedule/export.ics?group_id=X` endpoint returning RFC 5545 feed.

---

#### 3.9 Private Lesson Scheduling

**Why needed:** Many tutoring centres offer 1-to-1 lessons. The current model only supports groups.

**Business value:** Opens a new revenue stream; caters to advanced/remedial students.

**Recommended Model:**
```python
class PrivateLesson(models.Model):
    student = models.ForeignKey(Student, on_delete=models.CASCADE, related_name='private_lessons')
    teacher = models.ForeignKey(Teacher, on_delete=models.CASCADE, related_name='private_lessons')
    room = models.ForeignKey(Room, on_delete=models.PROTECT, related_name='private_lessons')
    date = models.DateField()
    start_time = models.TimeField()
    end_time = models.TimeField()
    price = models.DecimalField(max_digits=8, decimal_places=2)
    status = models.CharField(max_length=10, choices=Session.STATUS_CHOICES, default='PLANNED')
    notes = models.TextField(blank=True)
```

---

#### 3.10 Multi-Branch Support

**Why needed:** If the centre expands to multiple locations, the system has no concept of branch.

**Recommended Model:** Add `Branch` FK to `Room`, `Teacher`, and `CourseGroup`.

---

#### 3.11 Schedule Change Auto-Notification

**Why needed:** When a session is rescheduled or cancelled, no WhatsApp message is automatically sent. Currently, the admin must manually navigate to the WhatsApp module.

**Implementation:** Django signal on `Session.save()` — detect status change to `CANCELLED` or time/room change, then queue WhatsApp message via existing `whatsapp_send_ajax` infrastructure.

---

## 4. Code Review Findings

### 4.1 Model Design Issues

#### ❗ `Attendance` not linked to `Session`
```python
# Current (models.py:479)
class Attendance(models.Model):
    student = models.ForeignKey(Student, ...)
    course_group = models.ForeignKey(CourseGroup, ...)
    date = models.DateField(...)   # ← no Session FK
```
**Problem:** Attendance records a date + group, but is not linked to a specific `Session` object. This means:
- If a makeup session is created on the same day as a regular session, attendance is ambiguous.
- Payroll calculation (sessions with attendance) is inferred by date, not by session ID.
- The `unique_together = [['student', 'course_group', 'date']]` constraint prevents recording attendance for two sessions of the same group on the same day.

**Fix:** Add `session = models.ForeignKey(Session, on_delete=models.SET_NULL, null=True, blank=True)` to `Attendance` and update the unique constraint to `[['student', 'session']]`.

---

#### ❗ Missing `db_index` on high-frequency filter fields

```python
# Session model (models.py:535) only indexes 'date'
indexes = [models.Index(fields=['date'])]
```
**Missing indexes:**
- `Session.status` — filtered on every session query
- `Session.group` — FK, Django creates this automatically ✅
- `CourseGroupSchedule.day` — always filtered in conflict detection
- `Attendance.date` — frequently filtered in reports
- `Enrollment.is_active` — filtered on every financial calculation

**Fix:**
```python
class Meta:
    indexes = [
        models.Index(fields=['date']),
        models.Index(fields=['status']),
        models.Index(fields=['date', 'status']),   # composite
        models.Index(fields=['group', 'date']),    # composite
    ]
```

---

#### ❗ `detect_all_conflicts()` is O(n²) — will not scale

```python
# utils.py:622 — nested loops over all sessions
for i, s1 in enumerate(annotated_sessions):
    for s2 in annotated_sessions[i+1:]:
```
For 1,000 sessions this is 500,000 comparisons. At 10,000 sessions (1 year × 20 groups × 5 days × 10 weeks) = 50,000,000 comparisons.

**Fix:** Use Django ORM window functions or GROUP BY approach:
```python
# Find room conflicts with a self-join approach
Session.objects.filter(date=OuterRef('date'), room=OuterRef('room'))...
```
Or limit the `detect_all_conflicts()` call to a rolling 2-week window.

---

#### ❗ `generate_sessions_from_coursegroups()` — N+1 query on orphan cleanup

```python
# utils.py:775 — iterates over sessions and checks each against schedules list
for s in active_sessions:
    matching_schedule = None
    for sch in schedules:     # ← inner Python loop per session
```
For a group with 100 past sessions and 5 schedules, this is 500 Python comparisons per group, all in memory. Acceptable for small datasets but not future-proof.

**Fix:** Use `values_list('schedule_id', flat=True)` to get existing session schedule IDs in one query, then bulk-compare.

---

### 4.2 Security Concerns

#### ❗ No authentication on scheduling views

```python
# views.py — session_create, sessions_schedule, etc. have NO @login_required
def sessions_schedule(request):
    ...
def session_create(request):
    ...
```
**Problem:** Any anonymous user can access the full schedule, create sessions, or mark sessions as cancelled.

**Fix:** Apply `@login_required` (or a custom `@staff_required`) decorator to **all** scheduling views. The project appears to use `django-unfold` admin but the front-end views have zero authentication guards.

---

#### ❗ CSRF not verified on quick-status AJAX

```python
# views.py:912 — @require_POST is present but no explicit CSRF check documented
@require_POST
def session_quick_status_update(request, session_id):
```
`@require_POST` + Django middleware handles CSRF for standard forms, but the AJAX calls from the template must include the CSRF token. Verify the front-end JS is sending `X-CSRFToken` header; if using `fetch()` without it, the endpoint is vulnerable to CSRF.

---

### 4.3 Query Optimization Opportunities

| Location | Issue | Fix |
|----------|-------|-----|
| `sessions_today` → `session_filter` | `session_filter.qs` re-evaluates queryset after annotation | Pre-evaluate with `list()` before filter |
| `session_attendance` (line 596) | Loads all students of a group without prefetch | Add `select_related('level')` and `prefetch_related('enrollment_set')` |
| `detect_all_conflicts()` | Loads all future sessions into memory | Limit to next 14 days; add database-level unique checks |
| `_build_teacher_schedule()` | `substitute_teacher` sessions are NOT shown in teacher grid | Substitute sessions should appear in substitute teacher's row |

---

## 5. Upgrade Roadmap

### Phase 1 — Critical Fixes (Week 1–2)

| Priority | Task |
|----------|------|
| P0 | Add `@login_required` to all scheduling views |
| P0 | Add `Session` FK to `Attendance` model |
| P1 | Add composite DB indexes to `Session` |
| P1 | Implement student conflict detection in `Enrollment.clean()` |
| P1 | Create `Holiday` model + integrate into session generation |

### Phase 2 — Important Features (Week 3–5)

| Priority | Task |
|----------|------|
| P2 | Monthly calendar view (`sessions_monthly`) |
| P2 | `TeacherLeave` model + views |
| P2 | Makeup session workflow |
| P2 | Absence aggregation report view |
| P2 | Fix substitute teacher rows in teacher grid |

### Phase 3 — Advanced Features (Week 6–10)

| Priority | Task |
|----------|------|
| P3 | iCal export endpoint |
| P3 | `AcademicTerm` model + term-scoped reports |
| P3 | Private lesson scheduling |
| P3 | Auto-notification on session cancellation/change |
| P3 | Scalability refactor of `detect_all_conflicts()` |

---

## 6. Production-Ready Code: Highest-Priority Missing Features

### 6.1 Holiday Model & Session Generation Integration

```python
# models.py — add after AcademicTerm (or after Session)

class Holiday(models.Model):
    """School holidays and closures that suppress session generation."""
    name = models.CharField(max_length=200, verbose_name="Nom du congé")
    date = models.DateField(unique=True, verbose_name="Date")
    affects_all = models.BooleanField(
        default=True,
        verbose_name="Tous les groupes",
        help_text="Si coché, aucun groupe n'a de séance ce jour-là."
    )
    affected_groups = models.ManyToManyField(
        'CourseGroup',
        blank=True,
        related_name='holidays',
        verbose_name="Groupes affectés",
        help_text="Laissez vide si tous les groupes sont concernés."
    )
    notes = models.TextField(blank=True, verbose_name="Notes")
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = "Jour férié / Congé"
        verbose_name_plural = "Jours fériés / Congés"
        ordering = ['date']

    def __str__(self):
        return f"{self.name} ({self.date.strftime('%d/%m/%Y')})"
```

```python
# utils.py — update generate_sessions_from_coursegroups()
# After building `current` date for each schedule slot, add:

# Load holiday dates once before the outer loop
holiday_dates_all = set(
    Holiday.objects.filter(affects_all=True).values_list('date', flat=True)
)

# Inside the per-course loop:
holiday_dates_group = set(
    active_course.holidays.values_list('date', flat=True)
)
all_blocked = holiday_dates_all | holiday_dates_group

# Inside the while current <= end_date loop:
if current in all_blocked:
    current += timedelta(days=7)
    continue
```

---

### 6.2 Student Enrollment Conflict Detection

```python
# models.py — add clean() to Enrollment

class Enrollment(models.Model):
    # ... existing fields ...

    def clean(self):
        super().clean()
        if not self.student_id or not self.course_group_id:
            return

        new_schedules = self.course_group.schedules.all()
        if not new_schedules.exists():
            return

        existing_enrollments = Enrollment.objects.filter(
            student=self.student,
            is_active=True,
        ).exclude(pk=self.pk).select_related('course_group').prefetch_related('course_group__schedules')

        for existing in existing_enrollments:
            for existing_sch in existing.course_group.schedules.all():
                for new_sch in new_schedules:
                    if new_sch.day == existing_sch.day:
                        if (new_sch.start_time < existing_sch.end_time and
                                new_sch.end_time > existing_sch.start_time):
                            raise ValidationError(
                                f"Conflit d'horaire : L'élève '{self.student.name}' est "
                                f"déjà inscrit au groupe '{existing.course_group.name}' "
                                f"le {new_sch.get_day_display()} de "
                                f"{existing_sch.start_time.strftime('%H:%M')} à "
                                f"{existing_sch.end_time.strftime('%H:%M')}."
                            )
    
    def save(self, *args, **kwargs):
        self.full_clean()
        super().save(*args, **kwargs)
```

---

### 6.3 Monthly Calendar View

```python
# views.py — add after sessions_schedule

def sessions_monthly(request):
    """Monthly calendar view showing all sessions."""
    from .utils import auto_generate_future_sessions
    import calendar as cal_module
    from datetime import datetime as dt

    auto_generate_future_sessions()

    today = timezone.now().date()

    # Parse month/year from query params
    try:
        year = int(request.GET.get('year', today.year))
        month = int(request.GET.get('month', today.month))
        if not (1 <= month <= 12):
            raise ValueError
    except (ValueError, TypeError):
        year, month = today.year, today.month

    # Navigation
    first_day = date(year, month, 1)
    last_day = date(year, month, cal_module.monthrange(year, month)[1])

    if month == 1:
        prev_year, prev_month = year - 1, 12
    else:
        prev_year, prev_month = year, month - 1

    if month == 12:
        next_year, next_month = year + 1, 1
    else:
        next_year, next_month = year, month + 1

    # Filters
    group_filter = request.GET.get('group_id')
    teacher_filter = request.GET.get('teacher_id')
    room_filter = request.GET.get('room_id')

    # Sessions for the month
    sessions_qs = Session.objects.filter(
        date__range=[first_day, last_day]
    ).select_related('group', 'group__teacher', 'room')

    if group_filter:
        sessions_qs = sessions_qs.filter(group_id=group_filter)
    if teacher_filter:
        sessions_qs = sessions_qs.filter(group__teacher_id=teacher_filter)
    if room_filter:
        sessions_qs = sessions_qs.filter(room_id=room_filter)

    # Group sessions by date for the calendar
    sessions_by_date = {}
    for session in sessions_qs:
        key = session.date
        sessions_by_date.setdefault(key, []).append(session)

    # Build calendar weeks
    cal = cal_module.Calendar(firstweekday=0)  # Monday first
    weeks = []
    for week in cal.monthdatescalendar(year, month):
        week_days = []
        for d in week:
            week_days.append({
                'date': d,
                'is_current_month': d.month == month,
                'is_today': d == today,
                'sessions': sessions_by_date.get(d, []),
            })
        weeks.append(week_days)

    context = {
        'year': year,
        'month': month,
        'month_name': month_name_fr(month),
        'first_day': first_day,
        'weeks': weeks,
        'today': today,
        'prev_year': prev_year,
        'prev_month': prev_month,
        'next_year': next_year,
        'next_month': next_month,
        'courses': CourseGroup.objects.filter(is_active=True).order_by('name'),
        'teachers': Teacher.objects.filter(is_active=True).order_by('name'),
        'rooms': Room.objects.filter(is_active=True).order_by('name'),
        'group_filter': group_filter,
        'teacher_filter': teacher_filter,
        'room_filter': room_filter,
    }
    return render(request, 'core/sessions_monthly.html', context)
```

```python
# urls.py — add to urlpatterns
path('schedule/monthly/', views.sessions_monthly, name='sessions_monthly'),
```

---

### 6.4 Attendance ↔ Session FK Migration

```python
# In models.py — Attendance model, add field:
session = models.ForeignKey(
    'Session',
    on_delete=models.SET_NULL,
    null=True,
    blank=True,
    related_name='attendances',
    verbose_name="Séance",
    help_text="La séance spécifique à laquelle cette présence est liée."
)
```

```python
# Create migration:
# python manage.py makemigrations core --name="attendance_session_fk"
# python manage.py migrate
```

```python
# views.py — update session_attendance to set session FK
def session_attendance(request, session_id):
    session = get_object_or_404(Session, pk=session_id)
    # ... existing logic ...
    # When saving Attendance records:
    attendance_obj, created = Attendance.objects.update_or_create(
        student=student,
        course_group=session.group,
        date=session.date,
        defaults={
            'is_present': is_present,
            'session': session,  # ← add this
        }
    )
```

---

### 6.5 Composite DB Indexes Migration

```python
# In Session.Meta, replace existing indexes block:
class Meta:
    verbose_name = 'Session'
    verbose_name_plural = 'Sessions'
    ordering = ['-date', 'start_time']
    indexes = [
        models.Index(fields=['date'], name='session_date_idx'),
        models.Index(fields=['status'], name='session_status_idx'),
        models.Index(fields=['date', 'status'], name='session_date_status_idx'),
        models.Index(fields=['group', 'date'], name='session_group_date_idx'),
        models.Index(fields=['room', 'date'], name='session_room_date_idx'),
    ]
```

```python
# In Attendance.Meta:
class Meta:
    indexes = [
        models.Index(fields=['date'], name='attendance_date_idx'),
        models.Index(fields=['course_group', 'date'], name='attendance_group_date_idx'),
    ]
```

```python
# Generate and apply:
# python manage.py makemigrations core --name="add_scheduling_indexes"
# python manage.py migrate
```

---

## 7. Summary Score

| Category | Score | Key Gap |
|----------|-------|---------|
| Core Scheduling | 7/10 | Monthly view, private lessons |
| Teacher Scheduling | 5/10 | No availability/leave model |
| Student Scheduling | 4/10 | No conflict detection, no student calendar |
| Room Scheduling | 8/10 | No equipment/resource tracking |
| Conflict Detection | 7/10 | Student conflicts missing; O(n²) scaling |
| Calendar Features | 5/10 | No monthly view, no iCal |
| Schedule Management | 8/10 | No holidays, no terms |
| Attendance Integration | 6/10 | No Session FK on Attendance |
| Notification Integration | 7/10 | No auto-trigger on change/cancel |
| **Overall** | **6.3/10** | Solid foundation; critical gaps in student conflict detection, authentication, and monthly view |
