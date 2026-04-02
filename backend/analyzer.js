const fs = require('fs');

function analyzeLog(filePath) {
    const data = fs.readFileSync(filePath, 'utf-8');
    const lines = data.split('\n');

    let errors = [];
    let warnings = [];
    let jobFailures = [];
    let ctmErrors = [];

lines.forEach((line, index) => {
    // Generic
    if (line.includes("ERROR")) {
        errors.push({ line: index + 1, text: line });
    }

    if (line.includes("WARN")) {
        warnings.push({ line: index + 1, text: line });
    }

    // Job Failures
    if (
        line.includes("NOTOK") ||
        line.includes("NOT OK") ||
        line.includes("ENDED_NOTOK")
    ) {
        jobFailures.push({ line: index + 1, text: line });
    }

    // CTM Errors
    if (
        line.includes("CTM") ||
        line.includes("Control-M") ||
        line.includes("CCM")
    ) {
        if (line.includes("ERROR")) {
            ctmErrors.push({ line: index + 1, text: line });
        }
    }
});

    return {
        totalLines: lines.length,
        errorCount: errors.length,
        warningCount: warnings.length,
        jobFailureCount: jobFailures.length,
        ctmErrorCount: ctmErrors.length,
        errors,
        warnings,
        jobFailures,
        ctmErrors
    };
}

module.exports = analyzeLog;