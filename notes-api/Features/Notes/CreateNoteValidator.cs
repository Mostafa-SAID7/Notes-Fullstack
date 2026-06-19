using FluentValidation;

namespace NotesApi.Features.Notes;

public class CreateNoteValidator : AbstractValidator<CreateNoteCommand>
{
    private static readonly string[] ValidColors =
        ["default", "yellow", "green", "blue", "red", "purple", "orange", "pink", "brown"];

    public CreateNoteValidator()
    {
        RuleFor(x => x.Title)
            .NotEmpty().WithMessage("Title is required.")
            .MaximumLength(200).WithMessage("Title must not exceed 200 characters.");

        RuleFor(x => x.Desc)
            .NotEmpty().WithMessage("Description is required.")
            .MaximumLength(2000).WithMessage("Description must not exceed 2000 characters.");

        RuleFor(x => x.Color)
            .Must(c => string.IsNullOrEmpty(c) || ValidColors.Contains(c))
            .WithMessage($"Color must be one of: {string.Join(", ", ValidColors)}.");

        RuleForEach(x => x.Tags)
            .MaximumLength(50).WithMessage("Each tag must not exceed 50 characters.");

        RuleFor(x => x.Tags)
            .Must(t => t == null || t.Count <= 10)
            .WithMessage("A note can have at most 10 tags.");
    }
}
