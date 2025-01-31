export const config = {
    port: process.env.PORT || 3100,
    supportedPostCount: 15,
    databaseUrl: process.env.MONGODB_URI || 
    'mongodb+srv://techweb:dNhO0lOvE79jys2h@cluster0.ooees.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0',
    JwtSecret: process.env.JWT_SECRET || "b.vXQjn'V:T{(Eu2$s[%/]"
 };

 