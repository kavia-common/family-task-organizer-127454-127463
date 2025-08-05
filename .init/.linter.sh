#!/bin/bash
cd /home/kavia/workspace/code-generation/family-task-organizer-127454-127463/todo_backend
npm run lint
LINT_EXIT_CODE=$?
if [ $LINT_EXIT_CODE -ne 0 ]; then
  exit 1
fi

