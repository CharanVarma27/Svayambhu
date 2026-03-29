import os
import json
from dotenv import load_dotenv

load_dotenv()

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

# Use new google.genai SDK (replaces deprecated google.generativeai)
client = None
if GEMINI_API_KEY:
    try:
        from google import genai
        client = genai.Client(api_key=GEMINI_API_KEY)
        print("[LLM] Gemini 2.0 Flash initialized via google.genai SDK.")
    except ImportError:
        print("[LLM] google.genai not installed. Run: pip install google-genai")
    except Exception as e:
        print(f"[LLM] Gemini init failed: {e}")

def generate_dag_from_prompt(prompt: str, api_key: str = None, model_name: str = "gemini-2.0-flash"):
    """
    Takes a natural language prompt and asks Gemini to generate a JSON 
    representing the Directed Acyclic Graph (DAG) for the workflow.
    """
    from google import genai
    
    # Use the provided key or fall back to global
    current_key = api_key if api_key else GEMINI_API_KEY
    current_model = model_name if model_name else "gemini-2.0-flash"
    
    if not current_key:
        print("[LLM] No API Key provided (local or global). Bypassing LLM.")
        return None
        
    try:
        # Create a fresh client if a custom key is used, otherwise use global
        req_client = genai.Client(api_key=current_key) if api_key else client
        
        if not req_client:
            print("[LLM] Client initialization failed. Bypassing LLM.")
            return None

        system_prompt = """
        You are an Enterprise Workflow Architect AI.
        Convert the user's natural language request into a sequence of autonomous AI Agent tasks.
        
        You MUST respond with ONLY a valid JSON object matching this exact schema, with NO markdown formatting, NO backticks, and NO additional text:
        {
          "nodes": [
            {"id": 1, "name": "Extract Data", "owner": "DataSystem"},
            {"id": 2, "name": "Analyze Sentiment", "owner": "NvidiaNim"}
          ],
          "edges": [
            {"source": 1, "target": 2}
          ]
        }
        
        Rules for nodes:
        - Keep "name" concise and actionable (max 4 words).
        - Give an appropriate "owner" (like "HR_System", "Legal_Bot", "PaymentGateway").
        - If the prompt implies humans must approve something, include a node with "HUMAN_CHECK" in the name.
        """
        
        response = req_client.models.generate_content(
            model=current_model,
            contents=system_prompt + "\n\nRequest: " + prompt
        )
        text = response.text.replace("```json", "").replace("```", "").strip()
        data = json.loads(text)
        return dict(data)
    except Exception as e:
        print(f"LLM DAG Generation Failed: {e}")
        return None

    except Exception as e:
        print(f"LLM DAG Generation Failed: {e}")
        return None
