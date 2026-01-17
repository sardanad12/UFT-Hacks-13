from fastapi import APIRouter, HTTPException
from datetime import date, timedelta
from app.schemas.user import User, LanguageProgress
from app.schemas.lesson import LessonCompletionRequest

router = APIRouter()

@router.post("/complete", response_model=User)
async def complete_lesson(payload: LessonCompletionRequest):
    # 1. Authenticate User
    user = await User.find_one(User.email == payload.email)
    if not user or user.password_hash != payload.password_hash:
        raise HTTPException(status_code=401, detail="Invalid credentials")

    # --- LOGIC START ---
    today = date.today()

    # 2. Update Streak Logic
    if user.last_active_date == today:
        # Already learned today, do nothing to streak
        pass
    elif user.last_active_date == today - timedelta(days=1):
        # Learned yesterday -> Increment streak
        user.daily_streak += 1
    else:
        # Missed a day (or brand new) -> Reset streak to 1
        user.daily_streak = 1
    
    # Update the date
    user.last_active_date = today

    # 3. Update Global Stats
    user.total_lessons_completed += 1
    user.total_time_spent += payload.time_spent
    user.last_lesson_language = payload.language

    # 4. Update Specific Language Progress
    # We need to find if the user has studied this language before
    target_lang_progress = None
    
    for prog in user.languages_studied:
        if prog.language == payload.language:
            target_lang_progress = prog
            break
    
    if target_lang_progress:
        # Update existing language
        if payload.lesson_id not in target_lang_progress.completed_lessons:
            target_lang_progress.completed_lessons.append(payload.lesson_id)
        
        target_lang_progress.last_lesson_rating = payload.rating
        target_lang_progress.previous_lesson_notes = payload.new_notes
    else:
        # New language! Create new entry.
        new_progress = LanguageProgress(
            language=payload.language,
            level="Beginner", # Default
            completed_lessons=[payload.lesson_id],
            last_lesson_rating=payload.rating,
            previous_lesson_notes=payload.new_notes
        )
        user.languages_studied.append(new_progress)

    # 5. Save changes to MongoDB
    await user.save()

    return user