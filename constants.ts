export const LEETCODE_ACCEPTED_STATUS_CODE = 10;
export const LEETCODE_API_ADDRESS = "https://leetcode.com/graphql";
export const LEETCODE_COOKIE =
  "LEETCODE_SESSION=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJfYXV0aF91c2VyX2lkIjoiODU5OTE3NCIsIl9hdXRoX3VzZXJfYmFja2VuZCI6ImFsbGF1dGguYWNjb3VudC5hdXRoX2JhY2tlbmRzLkF1dGhlbnRpY2F0aW9uQmFja2VuZCIsIl9hdXRoX3VzZXJfaGFzaCI6ImY2NzdjMTQwZDliZTVkMTAzMGQ3ZDkyMzdlMmI5N2M2YmZlYTcxODhlZWNiZmNlNWJlYWU3NmQ5ZGM4NjdiNjciLCJzZXNzaW9uX3V1aWQiOiI1Y2M4ZmNkYiIsImlkIjo4NTk5MTc0LCJlbWFpbCI6InJ5YW5qYXJkaW5lNDNAZ21haWwuY29tIiwidXNlcm5hbWUiOiJyamFyZGluZSIsInVzZXJfc2x1ZyI6InJqYXJkaW5lIiwiYXZhdGFyIjoiaHR0cHM6Ly9hc3NldHMubGVldGNvZGUuY29tL3VzZXJzL3JqYXJkaW5lL2F2YXRhcl8xNzMwNTU3NTY2LnBuZyIsInJlZnJlc2hlZF9hdCI6MTc1MTQwMjU5OSwiaXAiOiIxNDIuMTY3LjE3My44NSIsImlkZW50aXR5IjoiOWVhODZjYzhmZGRhMjg5NWI5ZTM4YjlhYjUwYzljNjYiLCJkZXZpY2Vfd2l0aF9pcCI6WyJlYTYwNzQxMjI5ZWU5ZTQ3NGVkZDA1MTQ4OWMxZmNkYiIsIjE0Mi4xNjcuMTczLjg1Il0sIl9zZXNzaW9uX2V4cGlyeSI6MTIwOTYwMH0.rmRS_mOqd5gLgtHrqWawYPjM2jy56M0ZZfPLj7je1Nw";
export const LEETCODE_REFERER = "https://leetcode.com/problems";

export const LEETCODE_FULL_QUERY = `query submissionList($offset: Int!, $limit: Int!) {
          submissionList(offset: $offset, limit: $limit) {
            hasNext
            submissions {
              titleSlug
              status
            }
          }
        }`;
export const LEETCODE_QUESTIONID_QUERY = `
    query problemsetQuestionListV2($titleSlug: String!) {
      question(titleSlug: $titleSlug) {
        questionFrontendId
      }
    }`;

export const LEETCODE_QUESTION_ACCEPTED_STATUS = 10;
