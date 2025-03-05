const bcrypt = require("bcryptjs");

async function testPassword() {
    const hashedPassword = "$2b$10$JtkGFWUu9OR6TWkXwEHhnu9Vm1I/n0sRLZKnK96CAjAmiveyNxVum"; // Replace with DB password
    const enteredPassword = "admin123"; // Replace with input password

    const match = await bcrypt.compare(enteredPassword, hashedPassword);
    console.log("Password match:", match);
}

testPassword();
