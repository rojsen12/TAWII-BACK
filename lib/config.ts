export const config = {
    port: process.env.PORT || 3100,
    databaseUrl: process.env.MONGODB_URI || "mongodb+srv://filipkuciel3:proste123@cluster0.r7wvh.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0",
    JwtSecret: process.env.JWT_SECRET || 'default-secret',
    supportedPostCount: process.env.SUPPORTED_POST_COUNT ? parseInt(process.env.SUPPORTED_POST_COUNT, 10) : 10 // <--- Dodaj to
};
