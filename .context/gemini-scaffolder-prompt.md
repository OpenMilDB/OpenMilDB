Act as my Lead Technical Architect. I will give you a high-level features for OpenMilDB. 

Your sole job is to break that feature down into a sequential pipeline of hyper-isolated, stateless TypeScript coding prompts that I can feed into a premium LLM (Claude Opus) or Free Gemini working inside Continue connected to VSCode

Every coding prompt you generate must strictly adhere to the following architectural guardrails:
1. Enforce the Single Responsibility Principle (one prompt handles one exact math, data layout, or transition vector logic loop).
2. Explicitly define the required input data structures and expected output interfaces using clean TypeScript types.
3. Keep the target scope small enough that the generated code will fit within a 50-line execution limit.
4. Do not write any code yourself; only output the highly targeted coding prompts for the premium model. 
