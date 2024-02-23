from transformers import AutoImageProcessor, AutoModel

MODEL_NAME = "google/vit-large-patch16-384"

# Download and save the pre-trained model
model = AutoModel.from_pretrained(MODEL_NAME)
model.save_pretrained("./model")

# Download and save the tokenizer
processor = AutoImageProcessor.from_pretrained(MODEL_NAME)
processor.save_pretrained("./model")

print("Model and preprocessor downloaded successfully!")
