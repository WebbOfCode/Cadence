# Cadence - Quick Start Guide

## Getting Started

### 1. Install & Run
```bash
npm install
npm run dev
```
Open [http://localhost:3001](http://localhost:3001)

### 2. Set Up Environment
Create `.env.local` with your OpenAI API key:
```
OPENAI_API_KEY=your_key_here
```

## Using the App

### Onboarding Flow
1. **Enter your name** - Your full name for personalization
2. **Set ETS date** - When you're separating from service
3. **Select branch** - Army, Navy, Air Force, Marine Corps, Coast Guard, or Space Force
4. **Enter MOS** - Your military occupational specialty code
5. **Choose goal** - Career, Education, Housing, Finance, or Wellness
6. **Add location** (optional) - Where you're transitioning to
7. **VA disability claim** - Are you filing for disability?
8. **GI Bill** - Will you use your GI Bill?
9. **Review & generate** - AI creates your personalized mission plan

### Dashboard Features

#### Search Tasks
- Use the search bar to find tasks by title, description, or category
- Search updates in real-time as you type
- Combine with priority filters for more specific results

#### Filter by Priority
- **All** - See all tasks
- **High** - Critical, time-sensitive tasks
- **Medium** - Important but flexible timeline
- **Low** - Beneficial but optional

#### View Task Details
- Click any task to open the detail panel
- See full description, category, priority, and deadline
- Add personal notes to track your progress

#### Add Personal Notes
1. Click a task to open details
2. Click the edit icon next to "Personal Notes"
3. Type your notes (e.g., "Called VA on 12/1", "Need to get DD-214 copy")
4. Click "Save Notes"
5. Notes are automatically saved and persist across sessions

#### Track Progress
- **Days Until ETS** - Countdown to your separation date
- **Tasks Completed** - Visual progress bar showing completion percentage
- **Priority Status** - Quick view of high/medium priority completion
- **Overall Progress** - Percentage of all tasks completed

#### Export Your Plan
1. Click the **Export** button in the top right
2. A JSON file downloads with your complete mission plan
3. File includes all tasks, notes, progress, and metadata
4. Share with mentors or keep as backup

#### Start Over
1. Click **New Plan** in the header (or mobile menu)
2. Confirm you want to reset
3. Return to onboarding to create a new plan

## Tips & Best Practices

### Task Management
- ✅ Check off tasks as you complete them
- 📝 Add notes to track important details
- 🔍 Use search to find related tasks quickly
- 📊 Review priority status regularly

### Timeline Strategy
- Start with **High Priority** tasks first
- Plan **Medium Priority** tasks around high priority deadlines
- Use notes to track dependencies between tasks
- Export regularly to keep backups

### VA Benefits
- High priority tasks include VA enrollment and disability claims
- Follow deadlines closely - some have legal time limits
- Keep notes on all communications with VA
- Export your plan to share with VA representatives

### Career Transition
- Use notes to track job applications and interviews
- Search for "career" to see all career-related tasks
- Export plan to share with recruiters or mentors
- Update notes with networking contacts

## Keyboard Shortcuts

- **Ctrl/Cmd + F** - Browser find (works with search bar)
- **Tab** - Navigate between tasks
- **Enter** - Open selected task

## Troubleshooting

### Tasks not saving?
- Check browser console for errors
- Ensure localStorage is enabled
- Try refreshing the page

### Search not working?
- Make sure search term matches task content
- Try searching by category name
- Clear search to see all tasks

### Export not downloading?
- Check browser download settings
- Try a different browser
- Ensure pop-ups aren't blocked

### API errors during generation?
- Verify OpenAI API key is valid
- Check API key has available credits
- Ensure all onboarding fields are filled
- Try again in a few moments

## Data Privacy

- Your mission plan is stored locally in your browser
- No data is sent to external servers except OpenAI for plan generation
- Exported JSON files are stored on your computer
- Clear browser data to remove all stored information

## Support

For issues or questions:
1. Check the browser console for error messages
2. Review the IMPROVEMENTS.md file for feature details
3. Verify all required fields are filled during onboarding
4. Ensure OpenAI API key is properly configured

---

**Happy transitioning! 🎖️**
