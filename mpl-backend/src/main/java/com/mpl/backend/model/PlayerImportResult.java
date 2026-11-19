package com.mpl.backend.model;

import java.util.List;

public record PlayerImportResult(
        boolean dryRun,
        int totalRows,
        int toInsert,
        long existingToDelete,
        boolean applied,
        List<String> errors
) {}