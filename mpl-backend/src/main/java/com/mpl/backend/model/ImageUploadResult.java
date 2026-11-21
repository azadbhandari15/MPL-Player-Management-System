package com.mpl.backend.model;

import java.util.List;

public record ImageUploadResult(
        boolean dryRun,
        int totalRows,
        int updated,
        List<String> notFound,   // no matching player
        List<String> ambiguous,  // several players share that name
        List<String> invalid     // missing/unparseable image link
) {}