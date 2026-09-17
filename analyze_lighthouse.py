import json

with open('./lighthouse-report-final.json') as f:
    data = json.load(f)

categories = data.get('categories', {})
print("--- LIGHTHOUSE SCORES ---")
for k, v in categories.items():
    print(f"{v['title']}: {v.get('score', 0) * 100}")

print("\n--- MAJOR ISSUES ---")
audits = data.get('audits', {})
for key, audit in audits.items():
    score = audit.get('score')
    if score is not None and score < 0.9:
        print(f"[{audit.get('id')}] Score: {score} - {audit.get('title')}")
        print(f"  -> {audit.get('description')}")
